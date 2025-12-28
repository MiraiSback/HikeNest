import { describe, jest } from '@jest/globals';
import request from 'supertest';
import app from './app.js';
import jwt from 'jsonwebtoken';
import Utente from './models/utente.js';
import Percorso from './models/percorso.js';
import Gruppo from './models/gruppo.js';
import dotenv from 'dotenv';
dotenv.config();


describe('Test API utenti', () => {
    let utenteByIdSpy;
    let gruppoSpy;
    let percorsoByIdSpy;

    var options = {
        expiresIn: 86400 //24 ore di default
    }
    const token = jwt.sign({ id: '6', mail: 'pluto@test.com', bio: 'Bio vuota', username: 'Pluto' },
        process.env.SEGRETO_JWT,
        options
    );

    beforeAll(() => {
        //utente 123, gruppo 456, percorso 789
        utenteByIdSpy = jest.spyOn(Utente, 'findById').mockImplementation((id) => {
            return {
                exec: () => {
                    if (id == '123') {
                        return {
                            _id: '123',
                            username: "UtenteFalso",
                            mail: "mail@falso.com",
                            password: "hashed",
                            bio: "utente anonimo"
                        };
                    }
                    else {
                        return null;
                    }
                }
            };
        });

        gruppoSpy = jest.spyOn(Gruppo, 'find').mockImplementation((criterias) => {
            return {
                exec: () => [
                    {
                        _id: '456',
                        nome: 'Gruppo falso',
                        idPercorso: '789',
                        esperienza: 'neofita',
                        data: '1-1-2025',
                        utenti: ['123', '1'],
                        idCreatore: '1',
                        descrizione: 'Gruppo di test'
                    }
                ]
            };
        });

        percorsoByIdSpy = jest.spyOn(Percorso, 'findById').mockImplementation((id) => {
            return {
                exec: () => {
                    if (id == '789') {
                        return {
                            _id: '789',
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


    });

    afterAll(async () => {
        gruppoSpy.mockRestore();
        utenteByIdSpy.mockRestore();
        percorsoByIdSpy.mockRestore();
    });

    test('GET con un id valido deve restituire 200 e i dati corretti', async () => {
        return request(app)
            .get('/api/utenti/123')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .then((res) => {
                if (res.body) {
                    expect(res.body).toEqual({
                        self: '/api/utenti/123',
                        username: 'UtenteFalso',
                        mail: 'mail@falso.com',
                        bio: 'utente anonimo',
                        nGruppi: 1,
                        kmTotali: 10,
                        percorsoPreferito: '789'
                    })
                }
            })
    });

    test('GET con un id non esistente deve restituire 404', async () => {
        return request(app)
            .get('/api/utenti/999')
            .set('Authorization', 'Bearer ' + token)
            .expect(404, {message:'Utente non trovato'})
    });
});