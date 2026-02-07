import { describe, jest } from '@jest/globals';
import request from 'supertest';
import app from './app.js';
import jwt from 'jsonwebtoken';
import Percorso from './models/percorso.js';
import Gruppo from './models/gruppo.js';
import dotenv from 'dotenv';
dotenv.config();

describe('Test API gruppi', () => {
    let gruppoSpy;
    let gruppoByIdSpy;
    let percorsoByIdSpy;

    var options = {
        expiresIn: 86400 //24 ore di default
    }
    const token = jwt.sign({ id: '6', mail: 'pluto@test.com', bio: 'Bio vuota', username: 'Pluto' },
        process.env.SEGRETO_JWT,
        options
    );

    beforeAll(() => {
        gruppoSpy = jest.spyOn(Gruppo, 'find').mockImplementation((criterias) => {
            return {
                exec: () => [
                    {
                        _id: '123',
                        nome: 'Gruppo falso',
                        idPercorso: '456',
                        esperienza: 'neofita',
                        data: '1-1-2025',
                        utenti: ['6', '7'],
                        idCreatore: '1',
                        descrizione: 'Gruppo di test'
                    }
                ]
            };
        });

        percorsoByIdSpy = jest.spyOn(Percorso, 'findById').mockImplementation((id) => {
            return {
                exec: () => {
                    if (id == '456') {
                        return {
                            _id: '456',
                            nome: 'Camminata',
                            difficolta: 'facile',
                            lunghezzaKm: 10,
                            localitaPartenza: 'Povo'
                        };
                    }
                    else {
                        return null;
                    }
                }
            };
        });

        gruppoByIdSpy = jest.spyOn(Gruppo, 'findById').mockImplementation((id) => {
            return {
                exec: () => {
                    if (id == '123') {
                        return {
                            _id: '123',
                            nome: 'Gruppo falso',
                            idPercorso: '456',
                            esperienza: 'neofita',
                            data: '1-1-2025',
                            utenti: ['6', '7'],
                            idCreatore: '1',
                            descrizione: 'Gruppo di test'
                        };
                    }
                    else {
                        return null;
                    }
                }
            };
        });

    });

    afterAll(async () => {
        gruppoSpy.mockRestore();
        gruppoByIdSpy.mockRestore();
        percorsoByIdSpy.mockRestore();
    });

    test('GET /api/gruppi restituisce 200 e la lista dei gruppi', async () => {
        return request(app)
            .get('/api/gruppi')
            .set("Authorization", "Bearer " + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                if (res.body && res.body[0]) {
                    expect(res.body[0]).toEqual({
                        self: '/api/gruppi/123',
                        nome: 'Gruppo falso',
                        idPercorso: '456',
                        esperienza: 'neofita',
                        data: '1-1-2025',
                        idCreatore: '1',
                        descrizione: 'Gruppo di test'
                    })
                }
            })
    });

    test('POST /api/gruppi senza inserire un nome da errore', async () => {
        return request(app)
            .post('/api/gruppi')
            .set("Authorization", "Bearer " + token)
            .send({ nome: "", esperienza: "Neofita", descrizione: "Gruppo test", idPercorso: "456", data: "1-1-2025", idCreatore: "1" })
            .expect(400, { message: "Campi mancanti, gruppo non creato" })
    });

    test('POST /api/gruppi senza inserire una descrizione da errore 400', async () => {
        return request(app)
            .post('/api/gruppi')
            .set("Authorization", "Bearer " + token)
            .send({ nome: "Test", esperienza: "Neofita", descrizione: "", idPercorso: "456", data: "1-1-2025", idCreatore: "1" })
            .expect(400, { message: "Campi mancanti, gruppo non creato" })
    });

    test('POST /api/gruppi senza inserire un livello di esperienza da errore 400', async () => {
        return request(app)
            .post('/api/gruppi')
            .set("Authorization", "Bearer " + token)
            .send({ nome: "Test", esperienza: "", descrizione: "Gruppo test", idPercorso: "456", data: "1-1-2025", idCreatore: "1" })
            .expect(400, { message: "Campi mancanti, gruppo non creato" })
    });

    test('POST /api/gruppi con un percorso che non esiste da errore 400', async () => {
        return request(app)
            .post('/api/gruppi')
            .set("Authorization", "Bearer " + token)
            .send({ nome: "Test", esperienza: "Neofita", descrizione: "Gruppo test", idPercorso: "012", data: "1-1-2025", idCreatore: "1" })
            .expect(400, { message: "Il percorso inserito non esiste" })
    });

    test('GET /api/gruppi/gruppiUtente restituisce 200 e la lista dei gruppi dell\'utente', async () => {
        return request(app)
            .get('/api/gruppi')
            .set("Authorization", "Bearer " + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                if (res.body && res.body[0]) {
                    expect(res.body[0]).toEqual({
                        self: '/api/gruppi/123',
                        nome: 'Gruppo falso',
                        idPercorso: '456',
                        esperienza: 'neofita',
                        data: '1-1-2025',
                        idCreatore: '1',
                        descrizione: 'Gruppo di test'
                    })
                }
            })
    });

    test('GET /api/gruppi/:idGruppo restituisce 200 e i dati del gruppo se questo esiste', async () => {
        return request(app)
            .get('/api/gruppi/123')
            .set("Authorization", "Bearer " + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                if (res.body) {
                    expect(res.body).toEqual({
                        self: '/api/gruppi/123',
                        nome: 'Gruppo falso',
                        idPercorso: '456',
                        esperienza: 'neofita',
                        data: '1-1-2025',
                        idCreatore: '1',
                        descrizione: 'Gruppo di test'
                    })
                }
            })
    });


    test('GET /api/gruppi/:idGruppo restituisce 404 se il gruppo non esiste', async () => {
        return request(app)
            .get('/api/gruppi/789')
            .set("Authorization", "Bearer " + token)
            .expect('Content-Type', /json/)
            .expect(404)
    });

    test('GET /api/gruppi/:idGruppo/persone restituisce 200 e il numero di elementi del gruppo', async () => {
        return request(app)
            .get('/api/gruppi/123/persone')
            .set("Authorization", "Bearer " + token)
            .expect('Content-Type', /json/)
            .expect(200, {numeroUtenti: 2})
    });
    //id del token = 6, nel gruppo mockup uno degli utenti è il 6
    test('POST /api/gruppi/:idGruppo/persone restituisce 400 se l\'utente fa già parte del gruppo', async () => {
        return request(app)
            .post('/api/gruppi/123/persone')
            .set("Authorization", "Bearer " + token)
            .expect('Content-Type', /json/)
            .expect(400, {message: "L'utente è già presente nel gruppo"})
    });

});