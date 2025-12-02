import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Gruppo', new Schema({ 
    nome: String,
    idPercorso: String,
    esperienza: String,
    data: Date,
    utenti: [{
        type: Schema.Types.ObjectId,
        ref: "utente"
    }]
}));