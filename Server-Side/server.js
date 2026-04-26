import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoute.js";

dotenv.config();

const app = express();

const allowedOrigins = [
    process.env.CLIENT_ORIGIN,
    "http://localhost:5173",
    "http://localhost:5020",

].filter(Boolean);

const corsOptions = {
    origin:(origin,callback)=>{
        if(!origin || allowedOrigins.includes(origin)){
            callback(null,true);
        }else{
            callback(new Error("Not Allowed By CORS"));
        }
    },
    credential:true,
    methods:["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
}


app.use(cors(corsOptions));

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth",authRoutes);



app.use((err, _req, res, _next) => {
	console.error("Unhandled error:", err.message);
	res.status(500).json({ message: "Internal server error" });
});


const PORT = process.env.PORT || 5020;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
