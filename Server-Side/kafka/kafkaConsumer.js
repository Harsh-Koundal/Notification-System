import { Kafka } from "kafkajs";
import { sendMail } from "../utils/mailer.js";


const kafka = new Kafka({
    clientId:"email-service",
    brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({groupId:"email-group"});

await consumer.connect();

await consumer.subscribe({topic:"user-events"});

await consumer.run({
    eachMessage: async({message})=>{
        const event = JSON.parse(message.value.toString());

        if(event.type === "user.signup"){
            await sendMail({
                to:event.data.email,
                subject:"Welcome",
                text:"Thankyou for signup"
            })
        }
    }
});