import "dotenv/config";

export const ENV = Object.freeze( {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development",
    CLIENT_URL: process.env.CLIENT_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME
});

// fail fast in production for required keys
const requiredKeys = ["MONGO_URI", "JWT_SECRET", "CLIENT_URL", "RESEND_API_KEY", "EMAIL_FROM", "EMAIL_FROM_NAME"];
if(ENV.NODE_ENV === "production"){
    const missing = requiredKeys.filter((k) => !ENV[k]);
    if(missing.length){
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
}

