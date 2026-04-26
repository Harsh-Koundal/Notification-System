import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs:15*60*100,
    max:5,
    message:"Too many attempts. please try again later",
    standardHeaders:true,
    legacyHeaders:false,
});

