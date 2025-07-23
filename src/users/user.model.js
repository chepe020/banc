import { Schema, model } from 'mongoose';
import { generateUniqueAccountNumber } from '../middlewares/validator-users.js';

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [25, 'Name must be at most 25 characters long']
    },
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    noAccount: {
        type: String
    },
    dpi: {
        type: String,
        minlength: [13, 'DPI must be 13 characters'],
        maxlength: [13, 'DPI must be 13 characters'],
        sparse: true
    },
    direction: {
        type: String,
        required: [true, 'Address is required'],
        minlength: [10, 'Address must be at least 10 characters long']
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        minlength: [8, 'Phone must be 8 digits'],
        maxlength: [8, 'Phone must be 8 digits']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [10, 'Password must be at least 10 characters long']
    },
    work: {
        type: String,
        minlength: [5, 'Work must be at least 5 characters long']
    },
    nombreEmpresa: {
        type: String,
        minlength: [5, 'Company name must be at least 5 characters long']
    },
    income: {
        type: Number,
        required: [true, 'Income is required'],
        min: [100, 'Income must be greater than 100']
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: ['USER_ROLE', 'ADMIN_ROLE'],
        default: 'USER_ROLE'
    },
    typeAccount: {
        type: String,
        required: [true, 'Type account is required'],
        enum: ['NORMAL', 'EMPRESARIAL']
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});


UserSchema.pre('validate', function (next) {
    if (this.typeAccount === 'EMPRESARIAL') {
        if (!this.nombreEmpresa) {
            this.invalidate('nombreEmpresa', 'Company name is required for EMPRESARIAL accounts');
        }
        this.work = undefined;
    } else if (this.typeAccount === 'NORMAL') {
        if (!this.dpi) {
            this.invalidate('dpi', 'DPI is required for NORMAL accounts');
        }
        if (!this.work) {
            this.invalidate('work', 'Work is required for NORMAL accounts');
        }
        this.nombreEmpresa = undefined;
    }
    next();
});

UserSchema.pre('save', async function (next) {
    if (!this.noAccount) {
        this.noAccount = await generateUniqueAccountNumber();
    }
    next();
});



export default model('User', UserSchema);