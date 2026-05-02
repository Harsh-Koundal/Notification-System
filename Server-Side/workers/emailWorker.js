import { connectDB } from "../config/db.js";
import Notification from "../model/Notification.js";
import dotenv from "dotenv";
import path from "path";
import { sendMail } from "../utils/mailer.js";
import { getBackoffTime } from "../utils/backoff.js";

dotenv.config({
    path: path.resolve("../.env")
})

const MAX_RETRY = 3;

const processEmail = async () => {
    await connectDB();
    console.log("Email Worker Running...");

    while (true) {
        try {
            const notif = await Notification.findOneAndUpdate({
                status: "PENDING",
                type: "EMAIL",
                $or: [
                    { scheduledAt: null },
                    { scheduledAt: { $lte: new Date() } }
                ]
            },
                {
                    $set: { status: "PROCESSING" }
                },
                {
                    new: true
                }
            );

            if(!notif){
                await new Promise(res=> setTimeout(res,2000));
                continue;
            }

            try {
                await sendMail({
                    to: notif.metadata.email,
                    subject: notif.title,
                    text: notif.message,
                });

                notif.status = "SENT";
                notif.sentAt = new Date();
                await notif.save();

                console.log(`Email sent to ${notif.metadata.email}`);
            } catch (err) {
                notif.retryCount += 1;
                notif.error = err.message;

                if (notif.retryCount >= MAX_RETRY) {
                    notif.status = "FAILED",
                    console.log(`Permanently Failed for ${notif.metadata.email}`);
                } else {
                    const delay = getBackoffTime(notif.retryCount);

                    notif.status = "PENDING";
                    notif.scheduledAt = new Date(Date.now() + delay);
                    console.warn(`Retry ${notif.retryCount} in ${delay / 1000}s for ${notif.metadata.email}`);
                }

                await notif.save();
                console.log("Email Failed", err.message);
            }

        } catch (err) {
            console.error("Worker Error", err);
        }
    }
};
processEmail();