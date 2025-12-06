import app from './app/app.js';
import mongoose from 'mongoose';

//prendere la porta da .env, default è 8080
const porta = process.env.PORT || 8080;

app.locals.db = mongoose.connect( process.env.DB_URL)
.then( () => {
    console.log("Connesso al database");
    app.listen(port, () => {
        console.log(`Ascoltando sulla porta ${porta}`);
    });
}
)