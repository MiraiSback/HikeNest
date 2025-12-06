import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model('Percorso', new Schema({ 
    nome: String,
    difficolta: String,
    lunghezzaKm: Number,
    localitaPartenza: String
}));