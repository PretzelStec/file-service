import { hash, hashSync } from "bcrypt";
import {Request, Response} from "express";
import { User, userModel } from "../models/user.model";

export interface AddUserRequest extends Request{
    body: User
}

export async function addUserRouteHandler(req: AddUserRequest, res: Response) {
    const user: User = req.body;
    user.password = hashSync(user.password, 10);
    try {
        const userQuery = await userModel.find(
            {
                $or: [{email: user.email}, {username: user.username}]
            }
        );
        if(userQuery.length > 0){
            return res.status(400).send({message: "a user with that username or email already exists"});
        }
        const newUser = new userModel(user);
        await newUser.save();
        return res.send({message: "user created successfully"});
    } catch(err: any) {
        return res.status(500).send({error: err.message});
    }
}