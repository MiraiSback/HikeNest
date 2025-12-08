import app from './app/app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

//prendere la porta da .env, default è 8080
const porta = process.env.PORT || 8080;
console.log(process.env.DB_URL);
app.locals.db = mongoose.connect( process.env.DB_URL)
.then( () => {
    console.log("Connesso al database");
    app.listen(porta, () => {
        console.log(`Ascoltando sulla porta ${porta}`);
    });
}
)