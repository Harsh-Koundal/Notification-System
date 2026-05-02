import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "dlq-service",
    brokers: ["localhost:9092"],
});


const consumer = kafka.consumer({groupId: "dlq-group"});

await consumer.connect();
await consumer.subscribe({topic:"email-dlq"});

await consumer.run({
    eachMessage: async ({message}) =>{
        const data = JSON.parse(message.value.toString());

        console.log("DLQ Event Recived:",data);
    },
});
