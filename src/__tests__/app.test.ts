import request from 'supertest';
import { app } from '../app';

let server: any;

beforeAll((done) => {
  server = app.listen(() => {
    console.log('Server is running');
    done();
  });
});

test('GET /non-existent-route should return 404 with error message', async () => {
  const response = await request(app).get('/random-url-unrelated');

  expect(response.status).toBe(404);
  expect(response.text).toBe('Error Page 404');
}, 10000);

afterAll((done) => {
  server.close(() => {
    console.log('Server closed');
    done();
  });
});
