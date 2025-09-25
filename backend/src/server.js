import express from "express";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config(); 

const app = express(); 
const __dirname = path.resolve(); 

const PORT = process.env.PORT || 3000;

app.use(express.json());    //in the req.bodyS

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// prepare for deployment
if(process.env.NODE_ENV === "production"){
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