import Path from 'path';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';

import utenti from './utenti.js';
import gruppi from './gruppi.js';
import percorsi from './percorsi.js';
import registrazione from './registrazione.js';
import autenticazione from './autenticazione.js';
import tokenChecker from './tokenChecker.js';

import dotenv from 'dotenv';
dotenv.config();

//import dotenv from 'dotenv';
//dotenv.config();
//commentato, per render non serve, usa per implementazioni locali


//file = url del file, cartella = url cartella che contiene il file
const _file = fileURLToPath(import.meta.url);
const _cartella = Path.dirname(_file);

//leggi per poi caricare il file yaml per visualizzazione web
const swaggerDocument = yaml.load(readFileSync(Path.join(_cartella, '..', 'oas3.yaml'), 'utf8'));

const app = express(); //setup express

app.use(express.json());//setup lettura json
app.use(express.urlencoded({ extended: true }));//setup lettura form e requests

app.use(cors());//abilita request da un url differente

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));//abilita route per visualizzare file yaml

//AGGIUNGERE QUI VISUALIZZAZIONE FRONT END QUANDO è FATTO
//app.use('/HikeNest', express.static( process.env.FRONTEND));

//per ora solo parte statica per testare le api
//app.use('/', express.static('static'));

app.use('/api/autenticazione', autenticazione);
app.use('/api/registrazione', registrazione);

//a queste api si può accedere solo dopo il login
app.use('/api/utenti', tokenChecker);
app.use('/api/gruppi', tokenChecker);
app.use('/api/percorsi', tokenChecker);


//routing ai vari file contenenti le vere e proprie api
app.use('/api/utenti', utenti);
app.use('/api/gruppi', gruppi);
app.use('/api/percorsi', percorsi);

//check per eventuali 404
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });});

export default app;






