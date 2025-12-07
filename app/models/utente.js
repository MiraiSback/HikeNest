import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Utente', new Schema({ 
    username: String,
    mail: { type: String, unique: true },
    password: String, 
    bio: String
}));