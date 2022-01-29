import { compare } from "bcrypt";
import {Request, Response} from "express";
import { userModel } from "../models/user.model";
const JWT = require("jsonwebtoken");
// const token = req.headers["authorization"] && req.headers["authorization"].split("Bearer ")[1];
// const result = JWT.verify(token, process.env.JWT_SECRET);

export async function getUserDetailsRouteHandler(req: any, res: Response) {
    try {
        res.send(req.user);
    } catch(err) {
        return res.status(500).send({error: err.message});
    }
}