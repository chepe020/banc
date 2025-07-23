import { Schema, model } from 'mongoose';

const AccountRequestSchema = Schema({
    name: {
        type: String,
        required: true,
        maxLength: 25
    },
    username: {
        type: String,
        required: true
    },
    dpi: {
        type: String,
        minlength: 13,
        maxlength: 13,
    },
    direction: {
        type: String,
        required: true,
        minlength: 10
    },
    phone: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 8
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 10
    },
    work: {
        type: String,
        minlength: 5
    },
    nombreEmpresa: {
        type: String,
        minlength: 5
    },
    income: {
        type: Number,
        required: true,
        min: 100
    },
    typeAccount: {
        type: String,
        required: true,
        enum: ['NORMAL', 'EMPRESARIAL']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    rejectionReason: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('AccountRequest', AccountRequestSchema);