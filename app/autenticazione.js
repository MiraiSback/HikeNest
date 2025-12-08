import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client, PassThroughClient } from 'google-auth-library';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Utente from './models/utente.js';

import dotenv from 'dotenv';
dotenv.config();


const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verify(token) {
    try {
        const ticket = await client.verifyIdToken({ idToken: token });
        return ticket.getPayload();
    } catch (e) {
        return null;
    }
}

router.post('/', async function(req, res){
    var user = {};
    //se ho un token di google usa sso, se no vai di standard login
    if(req.body.googleToken){
        const payload = await verify(req.body.googleToken);
        if(payload == null){
            return res.status(401).json({message: "Token non valido"});
        }
        user = await Utente.findOne({mail:payload['email']}).exec();

        if(!user){
            //Crea nuovo Utente se non esiste
            //prendo la parte prima della @ come username + un numero random che non esista già
            //così evito di creare due username uguali, aggiungendo 4 cifre alla fine
            const baseUsername = payload.email.split('@')[0];
            var username;
            do{
                username = baseUsername + Math.floor(Math.random() * 10000);
            }while(await Utente.findOne({username: username}));

            //Creo una password casuale criptata da salvare nel db
            //gli account creati con google non riusciranno a fare login con email + password, ma saranno forzati ad usare l'SSO
            const randomPwd = crypto.randomBytes(16).toString('hex');
            const hashedPwd = await bcrypt.hash(randomPwd, 10);
            user = new Utente({
                username: username,
                mail: payload['email'],
                password: hashedPwd,
                bio: ' '
            });
            await user.save();
            //tolto exec() perchè dava errori

        }
    }
    else{
        user = await Utente.findOne({
            mail: req.body.mail
        }).exec();

        if(!user){
            res.status(401).json({message: 'Autenticazione fallita, utente non trovato'});
            return;
        }

        const pwdValida = await bcrypt.compare(req.body.password, user.password);
        if(!pwdValida){
            res.status(401).json({message: 'Autenticazione fallita, password errat'});
            return;
        }
        
        
    }

    //abbiamo trovato l'Utente, restituiamo il token
    var payload = {//tutto tranne la password obv
        email: user.mail, 
        id: user._id,
        bio: user.bio,
        username: user.username
    }
    var options = {
        expiresIn: 86400 //24 ore di default
    }

    var token = jwt.sign(payload, process.env.SEGRETO_JWT, options);

    res.json({
        success: true,
        message: 'Token creato',
        token: token,
        email: user.mail,
        id: user._id,
        self: 'api/utenti/'+user._id
    });

   
});

export default router;