import { jest } from '@jest/globals';
import request from 'supertest';
import app from './app.js';
import jwt from 'jsonwebtoken';
import Percorso from './models/percorso.js';
import Recensione from './models/recensione.js';
import Segnalazione from './models/segnalazione.js';
import dotenv from 'dotenv';
dotenv.config();


describe('GET api percorsi', () => {
    let percorsoSpy;
    let recensioneSpy;
    let segnalazioneSpy;
    let percorsoByIdSpy;
    var options = {
        expiresIn: 86400 //24 ore di default
    }
    console.log("SEGRETO AAAAA: " + process.env.SEGRETO_JWT);
    const token = jwt.sign({ id: '123', mail: 'pluto@test.com', bio: "Bio vuota", username: "Pluto" },
        process.env.SEGRETO_JWT,
        options
    );

    beforeAll(() => {
        percorsoSpy = jest.spyOn(Percorso, 'find').mockImplementation((criterias) => {
            return {
                exec: () => [
                    {
                        _id: "123",
                        nome: "Camminata",
                        difficolta: 'facile',
                        lunghezzaKm: 10,
                        localitaPartenza: "Povo"
                    }
                ]
            };
        });

        percorsoByIdSpy = jest.spyOn(Percorso, 'findById').mockImplementation((id) => {
            return {
                exec: () => {
                    if (id == "123") {
                        return {
                            _id: "123",
                            nome: "Camminata",
                            difficolta: 'facile',
                            lunghezzaKm: 10,
                            localitaPartenza: "Povo"
                        };
                    }
                    else {
                        return null;
                    }
                }
            };
        });

        recensioneSpy = jest.spyOn(Recensione, 'find').mockImplementation((criterias) => {
            return {
                exec: () => [
                    {
                        idUtente: '111',
                        testo: "Bello",
                        valutazione: 5
                    }
                ]
            };
        });
        segnalazioneSpy = jest.spyOn(Segnalazione, 'find').mockImplementation((criterias) => {
            return {
                exec: () => [
                    {
                        idUtente: '222',
                        testo: "Non bello"
                    }
                ]
            };
        });
    });

    afterAll(async () => {
        percorsoSpy.mockRestore();
        percorsoByIdSpy.mockRestore();
    });

    test("GET /api/percorsi deve restituire l'array di percorsi", async () => {
        return request(app)
            .get('/api/percorsi')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                if (res.body && res.body[0]) {
                    expect(res.body[0]).toEqual({
                        self: '/api/percorsi/123',
                        nome: "Camminata",
                        difficolta: 'facile',
                        lunghezzaKm: 10,
                        localitaPartenza: "Povo"
                    });
                }
            });
    });
    test("GET /api/percorsi senza jwt deve restituire 401", async () => {
        return request(app)
            .get('/api/percorsi')
            .expect('Content-Type', /json/)
            .expect(401)
    });

    test("GET /api/percorsi/:idPercorso restituisce un percorso", async () => {
        return request(app)
            .get('/api/percorsi/123')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                if (res.body) {
                    expect(res.body).toEqual({
                        self: '/api/percorsi/123',
                        nome: "Camminata",
                        difficolta: 'facile',
                        lunghezzaKm: 10,
                        localitaPartenza: "Povo"
                    });
                }
            });
    });

    test("GET /api/percorsi/:idPercorso con un id invalido da 404", async () => {
        return request(app)
            .get('/api/percorsi/456')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(404)
    });

    test("GET /api/percorsi/:idPercorso/recensioni restituisce 200 e le recensioni di un percorso", async () => {
        return request(app)
            .get('/api/percorsi/123/recensioni')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                if (res.body && res.body[0]) {
                    expect(res.body[0]).toEqual({
                        idUtente: '111',
                        testo: "Bello",
                        valutazione: 5
                    });
                }
            });
    });

    test("GET /api/percorsi/:idPercorso/segnalazioni restituisce 200 e le segnalazioni di un percorso", async () => {
        return request(app)
            .get('/api/percorsi/123/segnalazioni')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                if (res.body && res.body[0]) {
                    expect(res.body[0]).toEqual({
                        idUtente: '222',
                        testo: "Non bello",
                    });
                }
            });
    });

});

