import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/mailer.js";
import producer from "../kafka/kafkaProducer.js";

export const signup = async(req,res,next)=>{
    try{
        const {name,email,password} = req.body;

        if(!name || !email || !password)
            return res.status(400).json({message:"Name, Email & Password are required"});

        if(!validator.isEmail(email))
            return res.status(400).json({message:"Invalid Email Format"});

        if(password.length < 3)
            return res.status(400).json({message:"Password must be at least 3 characters"});

        const existingUser = await User.findOne({
            email:email.toLowerCase().trim(),
        });

        if(existingUser)
            return res.status(409).json({message:"User already Exists"});

        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password,saltRounds);

        const newUser = await User.create({
            name:name,
            email:email.toLowerCase().trim(),
            passwordHash,
        });

        await producer.send({
            topic:"user-events",
            messages:[
                {
                    value:JSON.stringify({
                        type:"user.signup",
                        data:{
                            userId:newUser._id,
                            email:newUser.email,
                            name:newUser.name,
                        },
                    }),
                },
            ],
        });


        
        return res.status(201).json({
            message:"User created Successfully",
            user:{
                id:newUser._id,
                email:newUser.email,
            },
        });
    }catch(err){
        console.error("Sign up error",err);
        return next(err);
    }
};