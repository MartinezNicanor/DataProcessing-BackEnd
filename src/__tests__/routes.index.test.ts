import request from 'supertest';
import express, { Request, Response } from 'express';
import { getIndexPage } from '../controller/index';
import router from '../routes/index';

// Mocking the controller function
jest.mock('../controller/index', () => ({
  getIndexPage: jest.fn(async (req: Request, res: Response) => {
    // Mock implementation, if needed
    res.status(200).json({ message: 'Index Page is Working' });
  }),
}));

const app = express();
app.use('/', router);

describe('GET /', () => {
  it('should call getIndexPage controller', async () => {
    // Make a request to the route
    const response = await request(app).get('/');

    // Assert that the controller function was called
    expect(getIndexPage).toHaveBeenCalled();

    // Assert the response status and content
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Index Page is Working' });
  });

  // You can add more tests as needed
});
