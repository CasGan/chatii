import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";


const app = express(); 
const __dirname = path.resolve(); 

const PORT = ENV.PORT || 3000;

app.use(express.json());    //in the req.bodyS
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
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on Port: ${PORT}`);
        });
    })
    .catch((err) =>{
        console.error("Failed to connect to MongoDB: ", err);
        process.exit(1);
    });

// app.listen(PORT, () => {
//     console.log("Server running on port:" + PORT);
//     connectDB();
// }); 