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
    const token = jwt.sign({ id: '123', mail: 'pluto@test.com', bio: 'Bio vuota', username: 'Pluto' },
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
                    if (id == '456') {
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

});