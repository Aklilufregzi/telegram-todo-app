import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
    telegram_id: {
        type: String, 
        required: true
    },
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    
    completed: {
        type: Boolean, 
        default: false
    },
    date: {
        type: String, 
        required: true
    }
})


export const Task = mongoose.model("Task", taskSchema)