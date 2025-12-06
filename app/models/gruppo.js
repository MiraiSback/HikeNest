import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Gruppo', new Schema({ 
    nome: String,
    idPercorso: {type: Schema.Types.ObjectId, ref: 'percorso'},
    esperienza: {
        type: String,
        enum: ['neofita', 'medio', 'esperto']
    },
    data: Date,
    utenti: [{
        type: Schema.Types.ObjectId,
        ref: "utente",
        default: []
    }],
    idCreatore: {type: Schema.Types.ObjectId, ref: 'utente'},
    descrizione: String

}));