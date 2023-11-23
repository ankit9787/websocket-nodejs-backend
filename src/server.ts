import { secret } from './../config';
import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import { Socket } from './types/socket.interface';
import  mongoose from "mongoose";
import * as usersController from "./controller/users";
import * as boardsController from "./controller/boards";
import bodyParser from "body-parser";
import authMiddleWare from "../middleware/auth";
import cors from "cors";
import { SocketEventsEnum } from "./types/socketEvents.enum";
import jwt from "jsonwebtoken";
import user from './models/user';
import * as columnsController from "./controller/columns";

const app = express();
const httpSever = createServer(app);
const io = new Server(httpSever, {
    cors:{
        origin: "*",
    }
});

app.use(cors());
app.use(bodyParser.json()); //to read API body as Json object in express
app.use(bodyParser.urlencoded({extended:true})); //doesn the same thing as above but for urlencoded type of data

mongoose.set("toJSON", {
    virtuals: true,
    transform: (_, converted) => {
      delete converted._id;
    },
  });

app.get("/", (req, res)=>{
    res.send("hi m wokring");
});

app.post("/api/users", usersController.register);

app.post("/api/users/login", usersController.login);

app.get("/api/user", authMiddleWare, usersController.currentUser);

app.get("/api/boards", authMiddleWare, boardsController.getBoards);

app.post("/api/boards", authMiddleWare, boardsController.createBoard);

app.get("/api/boards/:boardId", authMiddleWare, boardsController.getBoard);

app.get(
    "/api/boards/:boardId/columns",
    authMiddleWare,
    columnsController.getColumns
  );


io.use(async (socket: Socket, next) => {
    try {
        const token = (socket.handshake.auth.token as string) ?? "";
        
        const data = jwt.verify(token.split(" ")[1], secret) as {
            id: string,
            email: string
        };
        const usr = await user.findById(data.id);
        
    if(!usr){
        return next(new Error("Auth error"));
    }
    socket.user = usr;
    next();
    } catch (error) {
       next(new Error("Auth error")) 
    }
}).on('connection', (socket)=>{
    socket.on(SocketEventsEnum.boardsJoin, (data) => {
        console.log('join');
        boardsController.joinBoard(io, socket, data);
    });
    socket.on(SocketEventsEnum.boardsLeave, (data) => {
        console.log('leave');
        boardsController.leaveBoard(io, socket, data);
    });
    socket.on(SocketEventsEnum.columnsCreate, data => {
        columnsController.createColumn(io, socket, data)
      })
    
})

mongoose.connect('mongodb://localhost:27017/webscketdb').then(()=>{
    console.log("succes connnected");
    httpSever.listen(4001, () =>{
        console.log("Server started");
    });
    
})

