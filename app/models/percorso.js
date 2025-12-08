import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Percorso', new Schema({ 
    nome: String,
    difficolta: {
        type: String,
        enum: ['facile', 'medio', 'difficile']
    },
    lunghezzaKm: Number,
    localitaPartenza: String
}));