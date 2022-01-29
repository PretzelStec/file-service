import { Request, Response, NextFunction } from "express";

const jwt = require('jsonwebtoken');

export function authenticateToken(req: any, res: Response, next: NextFunction){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        return res.status(401).json({
            status:"failed",
            message : "not authorized null token"
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
        if(err) return res.status(401).json({
            status:"failed",
            message : "not authorized"
        });
        req.user = user;
        next();
    });
}