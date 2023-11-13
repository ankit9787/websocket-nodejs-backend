import { Request, Response, NextFunction } from "express";
import BoardModel from "../models/board";
import { ExpressInterfaceRequest } from "../types/expressRequest.interface";

export const getBoards = async (
  req: ExpressInterfaceRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const boards = await BoardModel.find({ userId: req.user.id });
    res.send(boards);
  } catch (err) {
    next(err);
  }
};


export const createBoard = async (
  req: ExpressInterfaceRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const newBoard = new BoardModel({
      title: req.body.title,
      userId: req.user.id
    })

    console.log('newBoard',newBoard);
    
    const saveBoard = await newBoard.save();
    res.send(saveBoard);
  } catch (err) {
    next(err);
  }
};