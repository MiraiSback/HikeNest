import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Utente', new Schema({ 
    username: { type: String, unique: true },
    mail: { type: String, unique: true },
    password: String, 
    bio: String
}));