import { Schema, model } from "mongoose";

const accountSchema = new Schema(
    {
        keeperUser: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        typeAccount: {
            type: String,
            required: true,
            enum: ['NORMAL', 'EMPRESARIAL']
        },
        noAccount: {
            type: String,
            required: true,
            unique: true
        },
        balance: {
            type: Number,
            required: true,
            min: [0, 'Balance cannot be negative'],
            default: 0
        },
        points: {
            type: Number,
            default: 0,
            min: [0, 'Points cannot be negative']
        },
        countTransactions: {
            type: Number,
            default: 0,
            min: [0, 'countTransactions no puede ser negativo']
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default model('Account', accountSchema)