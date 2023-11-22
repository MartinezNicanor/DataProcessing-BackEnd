import request from 'supertest';
import { app } from '../app';

let server: any; 

beforeAll(() => {
  server = app.listen();
});

test('GET /non-existent-route should return 404 with error message', async () => {
  const response = await request(app).get('/random-url-unrelated');

  expect(response.status).toBe(404);
  expect(response.text).toBe('Error Page 404');
});

afterAll((done) => {
  server.close(done);
});
