import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Utente', new Schema({ 
    username: String,
    mail: String,
    password: String, 
    bio: String
}));