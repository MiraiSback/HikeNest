import express from 'express';
import Gruppo from './models/gruppo.js';

const router = express.Router();

router.get('/', async function (req, res) {
    try {
        const gruppi = await Gruppo.find().exec();
        const risposta = gruppi.map(g => ({
            self: 'api/gruppi/' + g._id,
            nome: g.nome,
            idPercorso: g.idPercorso,
            esperienza: g.esperienza,
            data: g.data,
            idCreatore: g.idCreatore,
            descrizione: g.descrizione

        }));
        res.status(200).json(risposta);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel server' });
    }
});

router.post('/', async function (req, res) {
    try {
        const idUser = req.loggedUser.id;
        if(!req.body.nome || !req.body.esperienza || !req.body.descrizione){
            //prima faccio un check su questi campi per vedere se esistono, poi faccio un check con trim per vedere che non siano vuoti
            res.status(400).json({message: "Campi mancanti, gruppo non creato"});
            return; 
        }
        if(!req.body.nome.trim() || !req.body.idPercorso ||!req.body.esperienza.trim() ||!req.body.data ||!req.body.descrizione.trim()){
            res.status(400).json({message: "Campi mancanti, gruppo non creato"});
            return;
        }
        const nuovoGruppo = new Gruppo({
            nome: req.body.nome,
            idPercorso: req.body.idPercorso,
            esperienza: req.body.esperienza,
            data: req.body.data,
            idCreatore: idUser,
            descrizione: req.body.descrizione
        });

        await nuovoGruppo.save();

        res.status(201).json({
            message: "Gruppo creato",
            self: 'api/gruppi/' + nuovoGruppo._id
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel server' });
    }
});

router.get('/gruppiUtente', async function(req, res){
    try{
        const idUtente = req.loggedUser.id;
        const gruppi = await Gruppo.find({utenti: idUtente}).exec();

        const risposta = gruppi.map(g =>({
            self: 'api/gruppi/'+g._id,
            nome: g.nome,
            idPercorso: g.idPercorso,
            esperienza: g.esperienza,
            data: g.data,
            idCreatore: g.idCreatore,
            descrizione: g.descrizione
        }));
        res.status(200).json(risposta);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Errore nel server' });        
    }
});

router.get('/:idGruppo', async function (req, res) {
    try {
        const gruppo = await Gruppo.findById(req.params.idGruppo).exec();
        if (!gruppo) {
            res.status(404).json({ message: "Il gruppo non esiste" });
            return;
        }
        else {
            res.status(200).json({
                self: 'api/gruppi/' + gruppo._id,
                nome: gruppo.nome,
                idPercorso: gruppo.idPercorso,
                esperienza: gruppo.esperienza,
                data: gruppo.data,
                idCreatore: gruppo.idCreatore,
                descrizione: gruppo.descrizione
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel server' });
    }
});

router.post('/:idGruppo/persone', async function(req, res){
    try{
        const gruppo = await Gruppo.findById(req.params.idGruppo).exec();
        if (!gruppo) {
            res.status(404).json({ message: "Il gruppo non esiste" });
            return;
        }
        else{
            const idUtente = req.loggedUser.id;
            if(gruppo.utenti.includes(idUtente)){
                res.status(400).json({message: "L'utente è gia presente nel gruppo"});
                return;
            }
            else{
                gruppo.utenti.push(idUtente);
                await gruppo.save();
                res.status(201).json({ message: "Utente aggiunto al gruppo" });
            }
        }
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Errore nel server' });
    }
});

router.get('/:idGruppo/persone', async function(req, res){
    try{
         const gruppo = await Gruppo.findById(req.params.idGruppo).exec();
        if (!gruppo) {
            res.status(404).json({ message: "Il gruppo non esiste" });
            return;
        }
        else{
            const numUtenti = gruppo.utenti.length;
            res.status(200).json({
                numeroUtenti: numUtenti
            });
        }
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Errore nel server' });
    }
});




export default router;