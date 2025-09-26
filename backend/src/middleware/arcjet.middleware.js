import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({message: "Rate Limit Exceeded. Please try again later."});
            }
            else if(decision.reason.isBot()){
                return res.status(403).json({message: "Bot Access Denied."})
            }else{
            return res.status(403).json({message: "Access Denied by Security Policy."});
            }
        }

        //check for spoofed bots
        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({
                error: "Spoofed Bot Detected.",
                message: "Malicious Bot Activity Detected.",
            });
        }
        
        next();
    } catch (error) {
        console.log("Arcjet Protection Error: ", error);
        next();
    }
};