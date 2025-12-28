import { jest } from '@jest/globals';
import request from 'supertest';
import app from './app.js';
import Utente from './models/utente.js';
import dotenv from 'dotenv';
dotenv.config();


describe('Test API percorsi', () => {
    let utenteSpy;

    beforeAll(() => {
        utenteSpy = jest.spyOn(Utente, 'findOne').mockImplementation((criterias) => {
            return ({
                _id: '123',
                username: "UtenteFalso",
                mail: "mail@falso.com",
                password: "hashed",
                bio: "utente anonimo"
            })
        })
    });

    afterAll(async () => {
        utenteSpy.mockRestore();
    });

    test('POST con mail già esistente restituirà codice 409', async () => {
        return request(app)
            .post('/api/registrazione')
            .send({ mail: "mail@falso.com", username: "NuovoUsername", password: "hashed", bio: "Vuota" })
            .expect(409, { message: 'Email o username già esistente' })
    });

    test('POST con username già esistente restituirà codice 409', async () => {
        return request(app)
            .post('/api/registrazione')
            .send({ mail: "nuovaMail@falso.com", username: "UtenteFalso", password: "hashed", bio: "Vuota" })
            .expect(409, { message: 'Email o username già esistente' })
    });

});