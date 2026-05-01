import { connectDB } from "../config/db.js";
import Notification from "../model/Notification.js";
import dotenv from "dotenv";
import path from "path";
import { sendMail } from "../utils/mailer.js";

dotenv.config({
    path:path.resolve("../.env")
})


const processEmail = async()=>{
    await connectDB();
    console.log("Email Worker Running...");

    while(true){
        try{
            const notifications = await Notification.find({
                status:"PENDING",
                type:"EMAIL",
            }).limit(5);

            for(const notif of notifications){
                try{
                    await sendMail({
                        to:notif.metadata.email,
                        subject:notif.title,
                        text:notif.message,
                    });

                    notif.status = "SENT";
                    notif.sentAt = new Date();
                    await notif.save();

                    console.log(`Email sen to ${notif.metadata.email}`);
                }catch(err){
                    notif.retryCount += 1;
                    notif.status = "FAILED";
                    notif.error = err.message;

                    await notif.save();
                    console.log("Email Failed",err.message);
                }
            }
        }catch(err){
            console.error("Worker Error",err);
        }
        await new Promise(res=>setTimeout(res,2000));
    }
};
processEmail();