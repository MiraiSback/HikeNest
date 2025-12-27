import request from 'supertest';
import app from './app.js';

test('Endpoint deve essere definito', () => {
  expect(app).toBeDefined();
});

test('GET / deve restituire 200', () => {
  return request(app)
    .get('/')
    .expect(200);
});