import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve(); 

const PORT = ENV.PORT || 3000;

app.use(express.json({limit : "5mb" }));    //in the req.body
// app.use(express.json({ limit: "15mb" }));   //json bodies includes base64 data URLs
// app.use(express.urlencoded({extended: true, limit: "15mb"})); // form bodies


app.use(cors({origin: ENV.CLIENT_URL, credentials: true}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// prepare for deployment
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_, res) => { 
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));  
    })
}
// connectDB()
//     .then(() => {
//         server.listen(PORT, () => {
//             console.log(`Server running on Port: ${PORT}`);
//         });
//     })
//     .catch((err) =>{
//         console.error("Failed to connect to MongoDB: ", err);
//         process.exit(1);
//     });
// "server" instead of app since using socket.io
server.listen(PORT, () => {
    console.log("Server running on port:" + PORT);
    connectDB();
}); 