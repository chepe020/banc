import { Schema, model } from 'mongoose';

const FavoriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    favoriteAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    alias: {
        type: String,
        trim: true
    },
    isFavorite: {
        type: Boolean,
        default: true
    }
}, 
{
    timestamps: true,
    versionKey: false
});


export default model('Favorite', FavoriteSchema);
