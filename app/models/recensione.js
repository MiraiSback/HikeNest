import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Recensione', new Schema({ 
    idUtente: String,
    idPercorso: String,
    testo: String,
    valutazione: Number
}));