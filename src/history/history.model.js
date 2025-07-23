import { Schema, model } from "mongoose";

const historySchema = new Schema(
    {
        fromUser: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        toUser: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0.01
        },
        description: {
            type: String,
            maxlength: 100
        },
        transfer: {
            type: Schema.Types.ObjectId,
            ref: 'Transfer'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model("History", historySchema);