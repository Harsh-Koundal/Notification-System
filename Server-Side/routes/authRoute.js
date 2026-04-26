import express from  "express";
import { signup } from "../controller/authController.js";
import { authLimiter } from "../middleware/ratelimitMiddleware.js";

const router = express.Router();

router.post("/signup",authLimiter,signup);

export default router;