import supertest from 'supertest';
import app from '../../app';
import jwtTokenGenerator from '../../utils/jwt.generator';
import exp from 'constants';

const testEmail = 'zsombor1.hajzer@gmail.com';

const token = jwtTokenGenerator('24h', 'email', testEmail, 'purpose', 'authentication'); // Provide valid string arguments here

const authHeader = {
    Authorization: `Bearer ${token}`
};


describe('Rountes: /user ', () => {

    describe("DELETE /current  Delete Account",() => {
    });

    describe("POST /current/profiles   Profile Creation",() => {

        test.skip('Partial data submission: ProfileName only, should return 201', async () => {
            const response = await supertest(app)
                .post('/user/current/profiles')
                .set(authHeader)
                .field('profileName', 'joe')
            expect(response.status).toBe(201);
        });

        test.skip('Full Data submission: ProfileName, Image and Age should return 201', async () => {
            const response = await supertest(app)
                .post('/user/current/profiles')
                .set(authHeader)
                .field('profileName', 'joe')
                .field('age', '25')
                .field('language', 'en')
                .attach('profilePicture','src/images/default.jpeg', 'default.jpeg')
            expect(response.status).toBe(201);

        });
        
        test('No data submission: should return 400', async () => {
            const response = await supertest(app)
                .post('/user/current/profiles')
                .set(authHeader)
            expect(response.status).toBe(400);
        });

        
        

    });


    describe("GET /current/profiles/:profileId   Profile Retrieval",() => {
    });

    describe("PATCH /current/profiles/:profileId   Profile Update",() => {
    });

    describe("DELETE /current/profiles/:profileId   Profile Delete",() => {
    });

    describe("PATCH /current/new-billing-date   Update Billing Date",() => {
    });

    describe("PATCH /current/subscription   Update Payment Method",() => {
    });
});