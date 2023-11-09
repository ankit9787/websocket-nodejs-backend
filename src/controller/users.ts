import { NextFunction, Request, Response } from "express";
import userModel from "../models/user";
import { UserDocument } from "../types/user.interface";
import jwt from "jsonwebtoken";
import {secret} from '../../config'
import { ExpressInterfaceRequest } from "../types/expressRequest.interface";

const normalizedUser = (user: UserDocument) => {
    const token = jwt.sign({
        email: user.email,
        id: user.id
    }, secret)
    return {
        email: user.email,
        username: user.username,
        id: user.id,
        token
    };
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newuser = new userModel({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        console.log('new user', newuser);
        const savedUser = await newuser.save();
        // console.log('saveduser', savedUser);
        res.send(normalizedUser(savedUser));

    } catch (error) {
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userModel.findOne({
            email: req.body.email
        }).select("+password");

        if(!user){
            return res.status(404).json({
                "message": "user not found"
            })
        }

        const isSamePassword = await user.validatePassword(req.body.password);

        if(!isSamePassword){
            return res.status(404).json({
                "message": "user/pass wrong"
            })
        }
        res.send(normalizedUser(user))
    } catch (error) {
        next(error);
    }
}

export const currentUser = async (req: ExpressInterfaceRequest, res: Response) => {

    if(!req.user){
        return res.sendStatus(401);
    }

   return res.send(normalizedUser(req.user));
    // try {
    //     const newuser = new userModel({
    //         email: req.body.email,
    //         username: req.body.username,
    //         password: req.body.password
    //     });
    //     console.log('new user', newuser);
    //     const savedUser = await newuser.save();
    //     // console.log('saveduser', savedUser);
    //     res.send(normalizedUser(savedUser));

    // } catch (error) {
    //     next(error)
    // }
}
