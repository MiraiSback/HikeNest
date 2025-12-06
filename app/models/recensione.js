import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Recensione', new Schema({ 
    idUtente: { type: Schema.Types.ObjectId, ref: 'utente' },
    idPercorso: { type: Schema.Types.ObjectId, ref: 'percorso' },
    testo: String,
    valutazione: Number
}));