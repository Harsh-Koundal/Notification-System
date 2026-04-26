import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },

        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,
        },

        passwordHash:{
            type:String,
            required:true,
            select:false,
        },

        isBlocked:{
            type:Boolean,
            default:false,
        },

        loginAttempts:{
            type:Number,
            default:0,
        },

    },
    {timestamps:true},
);

export default mongoose.model("User",userSchema);