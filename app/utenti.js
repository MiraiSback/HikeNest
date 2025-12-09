import Utente from'./models/utente.js'
import express from 'express';
import Gruppo from './models/gruppo.js';
import Percorso from './models/percorso.js';

const router = express.Router();

router.get('/:id', async function(req, res){
    var user = await Utente.findById(req.params.idUtente).exec();
    if(!user){
        res.status(404).json({message : 'Utente non trovato'});
    }
    else{
        const listaGruppi = await Gruppo.find({utenti: req.params.idUtente}).exec();
        var listaPercorsi = [];
        var kmTot = 0;
        listaGruppi.forEach( async function (g){
            var idPercorso = g.idPercorso;
            var percorso = await Percorso.findById(idPercorso).exec();
            listaPercorsi.push(percorso);
            kmTot += percorso.lunghezzaKm;
        });
        const percorsoPreferito = 'none';

        res.status(200).json({
            self: 'api/utenti/' + user._id,
            username: user.username,
            mail: user.mail,
            bio: user.bio,
            nGruppi: listaGruppi.length,
            kmTotali: kmTot,
            percorsoPreferito: percorsoPreferito
        });
    }
});

export default router;