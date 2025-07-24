import { Schema, model } from 'mongoose';

const DepositoSchema = Schema({
    keeperAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    noAccount: {
        type: String,
        required: true
    },
    monto: {
        type: Number,
        required: [true, 'Price is required'],
        min: [1, 'Price must be greater than 1']
    },
    state: {
        type: Boolean,
        default: true
    },
},
{
    timestamps: true,
    versionKey: false
});

export default model('Deposito', DepositoSchema);