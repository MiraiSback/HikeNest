import express from 'express';
import Percorso from './models/percorso.js';
import Recensione from './models/recensione.js';
import Segnalazione from './models/segnalazione.js';
const router = express.Router();

router.get('/', async function (req, res) {
    try {

        //leggi tutti i parametri dalla query(se non ci sono non da errore)
        const { minKm, maxKm, difficolta, nome, localita } = req.query;

        let filtro = {};

        //gte <= lunghezza <= lte
        if (minKm || maxKm) {
            filtro.lunghezzaKm = {};
            if (minKm) filtro.lunghezzaKm.$gte = parseFloat(minKm);
            if (maxKm) filtro.lunghezzaKm.$lte = parseFloat(maxKm);
        }

        if (difficolta) {
            filtro.difficolta = difficolta;
        }

        // Filtro per nome con match parziale +  case insensitive
        if (nome) {
            filtro.nome = { $regex: nome, $options: 'i' };
        }

        // Filtro per località con match parziale +  case insensitive
        if (localita) {
            filtro.localitaPartenza = { $regex: localita, $options: 'i' };
        }

        // Esegui la query
        const percorsi = await Percorso.find(filtro).exec();

        const risposta = percorsi.map(p => ({
            self: `/api/percorsi/`+p._id,
            nome: p.nome,
            difficolta: p.difficolta,
            lunghezzaKm: p.lunghezzaKm,
            localitaPartenza: p.localitaPartenza
        }));

        res.status(200).json(risposta);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel server' });
    }

});

router.get('/:idPercorso', async function (req, res) {
    try {
        var hike = await Percorso.findById(req.params.idPercorso).exec();
        if (!hike) {
            res.status(404).json({ message: 'Questo percorso non esiste' });
            return;
        }
        else {
            res.status(200).json({
                self: 'api/percorsi/' + hike._id,
                nome: hike.nome,
                lunghezzaKm: hike.lunghezzaKm,
                difficolta: hike.difficolta,
                localitaPartenza: hike.localitaPartenza
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel server' });
    }
});


router.get('/:idPercorso/recensioni', async function (req, res) {
    try {
        var hike = await Percorso.findById(req.params.idPercorso).exec();
        if (!hike) {
            res.status(404).json({ message: 'Questo percorso non esiste' });
            return;
        }
        else {
            var recensioni = await Recensione.find({ idPercorso: hike._id }).exec();
            //self per ora rimosso per inutilizzo
            var risposta = recensioni.map(r => ({
                idUtente: r.idUtente,
                testo: r.testo,
                valutazione: r.valutazione
            }));
            res.status(200).json(risposta);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel server' });
    }
});

router.post('/:idPercorso/recensioni', async function (req, res) {
    try {
        const hike = await Percorso.findById(req.params.idPercorso).exec();
        if (!hike) {
            res.status(404).json({ message: 'Questo percorso non esiste' });
            return;
        }
        else {
            const idUtente = req.loggedUser.id;
            //controllo che la valutazione sia tra 1 e 5
            if (req.body.valutazione < 1 || req.body.valutazione > 5) {
                res.status(400).json({ message: "Valutazione deve essere tra 1 e 5" });
                return;
            }

            const nuovaRecensione = new Recensione({
                idPercorso: hike._id,
                idUtente: idUtente,
                testo: req.body.testo,
                valutazione: req.body.valutazione
            });

            await nuovaRecensione.save();

            res.status(201).json({
                message: 'Recensione creata'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel server' });
    }
});

router.get('/:idPercorso/segnalazioni', async function (req, res) {
    try {
        var hike = await Percorso.findById(req.params.idPercorso).exec();
        if (!hike) {
            res.status(404).json({ message: 'Questo percorso non esiste' });
            return;
        }
        else {
            var segnalazioni = await Segnalazione.find({ idPercorso: hike._id }).exec();

            var risposta = segnalazioni.map(s => ({
                idUtente: s.idUtente,
                testo: s.testo,
            }));
            res.status(200).json(risposta);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel server' });
    }
});

router.post('/:idPercorso/segnalazioni', async function (req, res) {
    try {
        const hike = await Percorso.findById(req.params.idPercorso).exec();
        if (!hike) {
            res.status(404).json({ message: 'Questo percorso non esiste' });
            return;
        }
        else {
            const idUtente = req.loggedUser.id;
            //check che il testo ci sia e non sia vuoto
            if (!req.body.testo || req.body.testo.trim() == '') {
                res.status(400).json({ message: 'Il testo della segnalazione è obbligatorio' });
                return;
            }

            const nuovaSegnalazione = new Segnalazione({
                idPercorso: hike._id,
                idUtente: idUtente,
                testo: req.body.testo
            });

            await nuovaSegnalazione.save();

            res.status(201).json({
                message: 'Segnalazione creata'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel server' });
    }
});



export default router;