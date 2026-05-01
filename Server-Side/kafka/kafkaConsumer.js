import { Kafka } from "kafkajs";
import { sendMail } from "../utils/mailer.js";
import Notification from "../model/Notification.js";
import { connectDB } from "../config/db.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path:path.resolve("../.env"),
});


const kafka = new Kafka({
    clientId:"email-service",
    brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({groupId:"email-group"});

await consumer.connect();
await connectDB();

await consumer.subscribe({
    topic:"user-events",
    fromBeginning:true,
});

await consumer.run({
    eachMessage: async({message})=>{
        const event = JSON.parse(message.value.toString());

        if(event.type === "user.signup"){
            try{
                await Notification.create({
                    userId:event.data.userId,
                    type:"EMAIL",
                    eventType:"user.signup",
                    title:"Welcome",
                    message:`Hi ${event.data.name}, thanks for signing up!`,
                    status:"PENDING",
                    metadata:{
                        email:event.data.email,
                    },
                });
                console.log("Notification stored in DB");
            }catch(err){
                console.error("Failed to store Notification",err);
            }
        }
    },
});