import express from 'express';
import Percorso from './models/percorso.js';

const router = express.Router();

router.get('/', async function(req, res){
    var percorsi = Percorso.find({});

    percorsi = percorsi.map( (percorso) =>{
        return {
            self : 'api/percorsi/' + percorso._id,
            nome : percorso.nome,
            lunghezzaKm : percorso.lunghezzaKm,
            difficolta: percorso.difficolta, 
            localitaPartenza: percorso.localitaPartenza
        };
    });
    res.status(200).json(percorsi);
});

