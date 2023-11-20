import { Request, Response } from 'express'; // Assuming you are using Express
import { getIndexPage } from '../controller/index';

// Mock Express Request and Response objects
const mockRequest = {} as Request;
const mockResponse = {
  status: jest.fn(() => mockResponse),
  json: jest.fn(),
} as unknown as Response;

// Test getIndexPage function
test('getIndexPage responds with status 200 and correct message', async () => {
  await getIndexPage(mockRequest, mockResponse);

  // Check if status and json methods were called with the expected values
  expect(mockResponse.status).toHaveBeenCalledWith(200);
  expect(mockResponse.json).toHaveBeenCalledWith({
    message: 'Index Page is Working',
  });
});
