import express from 'express';
import Percorso from './models/percorso.js';

const router = express.Router();

router.get('/', async function (req, res) {

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

    res.status(200).json(percorsi);

});

router.get('/:idPercorso', async function(req,res){
    var hike = await Percorso.findById(req.params.idPercorso).exec();
        if(!hike){
            res.status(404).json({message : 'Questo percorso non esiste'});
        }
        else{
            res.status(200).json({
                self: 'api/percorsi/' + hike._id,
                nome: hike.nome,
                lunghezzaKm: hike.lunghezzaKm,
                difficolta: hike.difficolta,
                localitaPartenza: hike.localitaPartenza
            });
        }
});

export default router;