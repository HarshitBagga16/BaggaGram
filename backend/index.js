import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app , server } from "./socket/socket.js";
// import path from "path"

dotenv.config({});

const PORT = process.env.PORT;

// const __dirname = path.resolve();

app.get("/" , (req,res) => {
    return res.status(200).json({
        message : `I am comming from backend`,
        success:true,
    })
})

app.use(express.json());
app.use(cookieParser()); //when we req to backend using browser our token will save in cookies
app.use(urlencoded({extended:true}));


const corsOption = {
    origin : process.env.FRONTEND_BASE_URL,
    credentials : true,
}
app.use(cors(corsOption));

//yhn par apni api aayegi

app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);

// app.use(express.static(path.join(__dirname, '/frontend/dist')));
// app.get("*" , (req,res) => {
//     res.sendFile(path.resolve(__dirname , "frontend" , "dist" , "index.html"))
// })


//"http://localhost:8000/api/user"


server.listen(PORT , () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`); 
})
