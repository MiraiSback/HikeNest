import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Segnalazione', new Schema({ 
    idUtente: String,
    idPercorso: String,
    testo: String,
}));