"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../controller/index");
// Mock Express Request and Response objects
const mockRequest = {};
const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
};
// Test getIndexPage function
test('getIndexPage responds with status 200 and correct message', () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, index_1.getIndexPage)(mockRequest, mockResponse);
    // Check if status and json methods were called with the expected values
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Index Page is Working',
    });
}));
