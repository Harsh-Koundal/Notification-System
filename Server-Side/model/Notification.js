import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: ["EMAIL", "PUSH", "IN_APP"],
            required: true,
        },

        eventType:{
            type:String,
            required:true,
        },

        title: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["PENDING", "SENT", "FAILED"],
            default: "PENDING",
            index: true,
        },

        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "MEDIUM",
        },

        metadata: {
            type: Object,
            default: {},
        },

        retryCount: {
            type: Number,
            default: 0,
        },

        scheduledAt: {
            type: Date,
        },

        sentAt: {
            type: Date,
        },
        error: {
            type: String,
        },
    },
    { timestamps: true, }
);

export default mongoose.model("Notification", NotificationSchema);
