import request from 'supertest';
import { app } from '../app';

test('GET /non-esistent-route should return 404 with error message',async () => {
    const response = await request(app).get('/asdasd')

    expect(response.status).toBe(404);
    expect(response.text).toBe('Error Page 404');
});
