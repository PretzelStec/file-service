import { Request, Response } from 'express';
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export async function authenticateUser(req: any, res: any, next: any){
    // here we want to check the users token. if we get a valid response then the user is good.

    const endpoint = process.env.USER_AUTHENTICATION_ENDPOINT;

    if(req.headers["authorization"]){
        const token = req.headers["authorization"].split("Bearer ")[1];

        const options: AxiosRequestConfig = {
            headers: {
                "authorization":"Bearer " + token
            }
        };
        try{

            const result: AxiosResponse = await axios.post(endpoint + "/verify", null, options); 
            req.user = result.data.data;
            console.log(req.user);
            next();

        }catch(err){
            res.status(403).json({
                error: "failed to authorize user :(",
                msg: err
            });
        }

    } else{
        res.status(403).json({
            error: "missing bearer token"
        });
    }
}