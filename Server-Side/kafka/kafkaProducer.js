import express from "express";
import { Kafka } from "kafkajs";

const app = express();
app.use(express.json());
