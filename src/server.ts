import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import  mongoose from "mongoose";
import * as usersController from "./controller/users";
import * as boardsController from "./controller/boards";
import bodyParser from "body-parser";
import authMiddleWare from "../middleware/auth";
import cors from "cors";

const app = express();
const httpSever = createServer(app);
const io = new Server(httpSever);

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


io.on('connection', ()=>{
    console.log("connected");
})

mongoose.connect('mongodb://localhost:27017/webscketdb').then(()=>{
    console.log("succes connnected");
    httpSever.listen(4001, () =>{
        console.log("Server started");
    });
    
})

