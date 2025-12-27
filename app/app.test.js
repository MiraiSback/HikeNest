import request from 'supertest';
import app from './app.js';

describe('Test base dell\'app', () => {
  test('Endpoint deve essere definito', () => {
    expect(app).toBeDefined();
  });

  test('GET / deve restituire 200', () => {
    return request(app)
      .get('/')
      .expect(200);
  });

  //provo un endpoint protetto per verificare che senza auth dia 401
  test('GET /api/utenti senza token deve restituire 401', async () => {
    const res = await request(app).get('/api/utenti');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch("Nessun token trovato");
  });

  test('GET endpoint inesistente deve restituire 404', async () => {
    const res = await request(app).get('/endpointCheNonEsiste');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Not found");
  });

});
