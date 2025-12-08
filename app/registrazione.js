import express from 'express';
import bcrypt from 'bcrypt';
import Utente from './models/utente.js';

const router = express.Router();

router.post('/', async function(req, res){
  try{
    //controlla che non ci siano username o email duplicate nel db
    let mail = req.body.mail;
    let username = req.body.username;
    const esistente = await Utente.findOne({ $or: [{ mail }, { username }] });
    if (esistente) {
      return res.status(409).json({ message: 'Email o username già esistente' });
    }

    const pwdHashed = await bcrypt.hash(req.body.password,10);//10 step di salting

    const nuovoUtente = new Utente({
        username: username, 
        mail : mail, 
        password: pwdHashed,
        bio : req.body.bio
    });

    await nuovoUtente.save();

    res.status(201).json({ message: 'Utente creato', self: '/api/utenti/' + nuovoUtente._id });
  } catch(err){
        console.error(err);
        res.status(500).json({message: 'Errore del server'});

    }
    
});

export default router;