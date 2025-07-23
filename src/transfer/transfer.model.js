import { Schema, model } from "mongoose";

const transferSchema = new Schema(
    {
        fromUser: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        toAccount: {
            type: String,
            required: [true, 'Destination account number is required']
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0.01, 'Amount must be greater than 0']
        },
        description: {
            type: String,
            maxlength: [100, 'Description must be at most 100 characters']
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default model('Transfer', transferSchema);