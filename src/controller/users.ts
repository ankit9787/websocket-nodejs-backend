import { NextFunction, Request, Response } from "express";
import userModel from "../models/user";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newuser = new userModel({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        console.log('new user', newuser);
        const savedUser = await newuser.save();
        console.log('saveduser', savedUser);
        
    } catch (error) {
        next(error)
    }
}