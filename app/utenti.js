import Utente from'./models/utente.js'
import express from 'express';

const router = express.Router();

router.get('/:id', async function(req, res){
    var user = await Utente.findById(req.params.idUtente).exec();
    if(!user){
        res.status(404).json({message : 'Utente non trovato'});
    }
    else{
        res.status(200).json({
            self: 'api/utenti/' + user._id,
            username: user.username,
            mail: user.mail,
            bio: user.bio
        });
    }
});

export default router;