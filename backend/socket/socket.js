import {Server} from "socket.io"
import express from "express"
import http from "http"
import dotenv from 'dotenv';

dotenv.config({});


const app = express();

const server = http.createServer(app);

const io = new Server(server , {
    cors : {
        origin:process.env.FRONTEND_BASE_URL,
        methods:['GET','POST']
    }
})

const userSocketMap = {} ;
 //this map stores socket id corresponding the user id -> socket Id

 export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId]

io.on('connection' , (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId)
    {
        userSocketMap[userId] = socket.id;
        console.log(`User Connected : UserId = ${userId} , SocketId = ${socket.id}`)
    }

    io.emit('getOnlineUsers' , Object.keys(userSocketMap))

    socket.on('disconnect' , () =>{
        if(userId)
        {
        console.log(`User Disonnected : UserId = ${userId} , SocketId = ${socket.id}`)

            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers' , Object.keys(userSocketMap))
    })
})

export {app ,server , io};