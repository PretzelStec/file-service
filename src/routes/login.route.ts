import { compare } from "bcrypt";
import {Request, Response} from "express";
import { userModel } from "../models/user.model";
const JWT = require("jsonwebtoken");

export async function loginRouteHandler(req: Request, res: Response) {
    try {
        const body = req.body;
        const email: string = body.email;
        const password: string = body.password;
        const token = await getToken(email, password);
        return res.status(200).json({
            token: token
        });
    } catch(err) {
        return res.status(500).send({error: err.message});
    }
}

export async function getToken(email: string, password: string): Promise<string> {
    const queryRes = await userModel.findOne({email: email});   
    if(queryRes && await compare(queryRes.password, password)){
           return JWT.sign({
                  userId: queryRes._id,
                  email: queryRes.email,
                  username: queryRes.username,
           }, process.env.JWT_SECRET);
    }
    throw(new Error("email and password dont match."));
}