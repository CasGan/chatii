import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
        //check first 
        const {MONGO_URI} = process.env;
        if(!MONGO_URI) throw new Error("MONGO_URIis not set");

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGODB CONNECTED", conn.connection.host);
    } catch(error){
        console.error("Error connection to MONGODB:", error);
        process.exit(1); 
    }
}