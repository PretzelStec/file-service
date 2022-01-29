import { connect, mongo, connection, connections, Types } from "mongoose";
import multer from "multer";
import path from "path";
import { imageModel } from "./src/models/user.model";
import { getUserDetailsRouteHandler } from "./src/routes/get-user-details.route";
import { authenticateUser } from "./src/services/authenticate-user.service";

const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const express = require("express");

require("dotenv").config();
//Create Mongo Connection

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

connect(
    process.env.ATLAS_URI
);

let bucket
connection.on("connected", () => {
    const client = connections[0].getClient;
    const db = connections[0].db;

    bucket = new mongo.GridFSBucket(db, {bucketName: "bucket"});
    console.log("Db connection established...");
});

app.use((req:any, res:any, next:any)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

const bucketStore = new GridFsStorage({
    url: process.env.ATLAS_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            if (file.mimetype.startsWith("image/")){
                console.log(req.body.title);
                const filename = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
                const fileInfo ={
                    metadata: {
                        userId: req.user.userId,
                        title: req.body.title
                    },
                    filename: filename,
                    bucketName: "bucket"
                };
                resolve(fileInfo);
            } else {
                reject(new Error("invalid mimetype"));
            }
        });
    }
});

const upload = multer({storage: bucketStore});

app.post("/upload", authenticateUser, upload.single("file"), (req, res) => {
    res.status(200)
        .json({message: "File uploaded successfully"});
});

app.get("/getFile/:filename",(req, res) => {
    try{
        bucket.find({
                filename: req.params.filename
            })
            .toArray((err, files) => {
                if (!files || files.length === 0) {
                    return res.status(404)
                        .json({
                             err: "no files exist"
                        });
                }
                bucket.openDownloadStreamByName(req.params.filename)
                    .pipe(res);
            });
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

app.delete("/deleteFile/:fileid", authenticateUser, async (req, res) => {
    try{
        const postId = new Types.ObjectId(req.params.fileid);
        await bucket.delete(postId);
        res.status(200).json({message: "OK"});
        
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

app.get("/getMyUploads", authenticateUser, async (req, res) => {
    try {
        const result = await imageModel.find({ "metadata.userId": req.user.userId })
        res.send(result);
    } catch(err) {
        return res.status(500).send({error: err.message});
    }
});

app.get("/myuserdetails", authenticateUser, getUserDetailsRouteHandler);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});

