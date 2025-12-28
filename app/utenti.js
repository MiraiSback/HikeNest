import Utente from './models/utente.js'
import express from 'express';
import Gruppo from './models/gruppo.js';
import Percorso from './models/percorso.js';

const router = express.Router();

router.get('/:id', async function (req, res) {
    var user = await Utente.findById(req.params.id).exec();
    if (!user) {
        res.status(404).json({ message: 'Utente non trovato' });
    }
    else {
        const listaGruppi = await Gruppo.find({ utenti: req.params.id }).exec();
        var kmTot = 0;
        const frequenzePercorsi = {};//array dove salvo le occorrenze per percorso
        for (const g of listaGruppi) {
            const percorso = await Percorso.findById(g.idPercorso).exec();
            if (!percorso) {
                continue;
            }

            kmTot += percorso.lunghezzaKm;

            if (!frequenzePercorsi[percorso._id]) {
                frequenzePercorsi[percorso._id] = 0;
            }
            frequenzePercorsi[percorso._id]++;
        }
        var idPreferito = 'none'; 

        //cerco il percorso più frequentato dall'utente
        if (Object.keys(frequenzePercorsi).length > 0) {//check se ho almeno 1 chiave diversa dalle altre, solo length dava errore

            // Trovo la frequenza massima
            const maxFrequenza = Math.max(...Object.values(frequenzePercorsi));

            //id del percorso da restituire
            for (const g of listaGruppi) {
                const id = g.idPercorso;
                if (frequenzePercorsi[id] === maxFrequenza) {
                    idPreferito = id;
                    break; 
                }
            }
        }

        res.status(200).json({
            self: '/api/utenti/' + user._id,
            username: user.username,
            mail: user.mail,
            bio: user.bio,
            nGruppi: listaGruppi.length,
            kmTotali: kmTot,
            percorsoPreferito: idPreferito
        });
    }
});

export default router;