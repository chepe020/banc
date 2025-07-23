import { Schema, model } from 'mongoose';

const ProductSchema = Schema({
    nameProduct: {
        type: String,
        required: [true, 'Name product is required'],
        minlength: [5, 'Name product must be at least 5 characters long']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [1, 'Price must be greater than 1']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [5, 'Description must be at least 5 characters long']
    },
    keeperUser:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

export default model('Product', ProductSchema);