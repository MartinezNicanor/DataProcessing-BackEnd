import supertest from 'supertest';
import app from '../../app';
import jwtTokenGenerator from '../../utils/jwt.generator';
import { db } from '../../db';


const testEmail = 'zsombor1.hajzer@gmail.com';

const token = jwtTokenGenerator('24h', 'email', testEmail, 'purpose', 'authentication'); // Provide valid string arguments here

const authHeader = {
    Authorization: `Bearer ${token}`
};

describe('Rountes: /user ', () => {

    describe("DELETE /current Delete Account", () => {
    });

    describe("POST /current/profiles  Profile Creation", () => {

        describe("Successful Profile Creations", () => {

            //delete the user profiles after each test so it doesnt affect the next test
            afterEach(async () => {
                const randomProfile = await db.one('SELECT * FROM profile WHERE account_id = (SELECT account_id FROM account WHERE email = $1) ORDER BY profile_id DESC LIMIT 1', [testEmail]);
                await supertest(app).delete(`/user/current/profiles/${randomProfile.profile_id}`).set(authHeader);
            });

            test('Partial data submission: ProfileName only, should return 201', async () => {
                const response = await supertest(app)
                    .post('/user/current/profiles')
                    .set(authHeader)
                    .field('profileName', 'joe')
                expect(response.status).toBe(201);
                expect(response.body.profile.profile_name).toEqual('joe');
                expect(response.body.profile.age).toEqual(0);
                expect(response.body.profile.language).toEqual('en');
                expect(response.body.profile.preferences.movie).toEqual([]);
                expect(response.body.profile.preferences.series).toEqual([]);
                expect(response.body.profile.preferences.min_age).toEqual([]);
                expect(response.body.profile.preferences.viewing_class).toEqual([]);
            });

            test('Full Data submission: ProfileName, Image and Age should return 201', async () => {
                const response = await supertest(app)
                    .post('/user/current/profiles')
                    .set(authHeader)
                    .field('profileName', 'joe')
                    .field('age', '25')
                    .field('language', 'en')
                    .attach('profilePicture', 'src/images/default.jpeg', 'default.jpeg')
                expect(response.status).toBe(201);
                expect(response.body.profile.age).toEqual(25);
                expect(response.body.profile.language).toEqual('en');
                expect(response.body.profile.profile_name).toEqual('joe');
                expect(response.body.profile.preferences.movie).toEqual([]);
                expect(response.body.profile.preferences.series).toEqual([]);
                expect(response.body.profile.preferences.min_age).toEqual([]);
                expect(response.body.profile.preferences.viewing_class).toEqual([]);
            });

            test('Partial data submission: Language header set to "Be" should return 201', async () => {
                const response = await supertest(app)
                    .post('/user/current/profiles')
                    .set(authHeader)
                    .set({ 'accept-language': 'Be' })
                    .field('profileName', 'joe')
                    .field('age', '25')
                    .attach('profilePicture', 'src/images/default.jpeg', 'default.jpeg')
                expect(response.status).toBe(201);
                expect(response.body.profile.age).toEqual(25);
                expect(response.body.profile.language).toEqual('Be');
                expect(response.body.profile.profile_name).toEqual('joe');
                expect(response.body.profile.preferences.movie).toEqual([]);
                expect(response.body.profile.preferences.series).toEqual([]);
                expect(response.body.profile.preferences.min_age).toEqual([]);
                expect(response.body.profile.preferences.viewing_class).toEqual([]);
            });

            test('Full Data submission with invalid age, less than 0: Should set age to 0 and return 201', async () => {
                const response = await supertest(app)
                    .post('/user/current/profiles')
                    .set(authHeader)
                    .field('profileName', 'joe')
                    .field('age', '-6')
                    .field('language', 'en')
                    .attach('profilePicture', 'src/images/default.jpeg', 'default.jpeg')
                expect(response.status).toBe(201);
                expect(response.body.profile.age).toEqual(0);
            });

            test('Full Data submission with invalid age, more than 150: Should set age to 0 and return 201', async () => {
                const response = await supertest(app)
                    .post('/user/current/profiles')
                    .set(authHeader)
                    .field('profileName', 'joe')
                    .field('age', '151')
                    .field('language', 'en')
                    .attach('profilePicture', 'src/images/default.jpeg', 'default.jpeg')
                expect(response.status).toBe(201);
                expect(response.body.profile.age).toEqual(0);
            });
        });

        //delete the user profiles after each test so it doesnt affect the next test
        describe("Unsuccessful Profile Creations", () => {

            test('No data submission: should return 400', async () => {
                const response = await supertest(app)
                    .post('/user/current/profiles')
                    .set(authHeader)
                expect(response.status).toBe(400);
            });

            test('Too long accept-language header, 7+ characters, should return 400', async () => {
                const response = await supertest(app)
                    .post('/user/current/profiles')
                    .set(authHeader)
                    .set({ 'accept-language': 'Belgium' })
                    .field('profileName', 'joe')
                    .field('age', '25')
                    .attach('profilePicture', 'src/images/default.jpeg', 'default.jpeg')
                expect(response.status).toBe(400);
                expect(response.body.error).toEqual('Invalid input values');
            });

            test('Invalid accept-langauge header variable type, numbers, should return 400', async () => {
                const response = await supertest(app)
                    .post('/user/current/profiles')
                    .set(authHeader)
                    .set({ 'accept-language': 0 })
                    .field('profileName', 'joe')
                    .field('age', '25')
                    .attach('profilePicture', 'src/images/default.jpeg', 'default.jpeg')
                expect(response.status).toBe(400);
                expect(response.body.error).toEqual('Invalid input values');
            });

            test.only('Invalid accept-langauge has special characters, should return 400', async () => {
                const response = await supertest(app)
                    .post('/user/current/profiles')
                    .set(authHeader)
                    .set({ 'accept-language': "@@" })
                    .field('profileName', 'joe')
                    .field('age', '25')
                    .attach('profilePicture', 'src/images/default.jpeg', 'default.jpeg')
                expect(response.status).toBe(400);
                expect(response.body.error).toEqual('Invalid input values');
            });

            test('Empty name field, should return 400', async () => {
                const response = await supertest(app)
                .post('/user/current/profiles')
                .set(authHeader)
                .set({ 'accept-language': 'asd' })
                .field('profileName', '')
                .field('age', '25')
                .attach('profilePicture', 'src/images/default.jpeg', 'default.jpeg')
                expect(response.status).toBe(400);
                expect(response.body.error).toEqual('Invalid input values');
            });

            describe('Maximum number of profiles', () => {

                beforeAll(async () => {
                    //delete all profiles associated with the user before the test
                    await db.none('DELETE FROM profile WHERE account_id = (SELECT account_id FROM account WHERE email = $1)', [testEmail]);
                });

                afterAll(async () => {
                    //Delete the user profiles after the test
                    await db.none('DELETE FROM profile WHERE account_id = (SELECT account_id FROM account WHERE email = $1)', [testEmail]);

                    //Create one profile to not affect the other tests
                    await supertest(app)
                        .post('/user/current/profiles')
                        .set(authHeader)
                        .field('profileName', 'joe')
                });

                test('Create 4 profiles, then try to create a 5th, should return 400', async () => {
                    for (let i = 0; i < 4; i++) {
                        await supertest(app)
                            .post('/user/current/profiles')
                            .set(authHeader)
                            .field('profileName', `joe`)
                    }
                    const response = await supertest(app)
                        .post('/user/current/profiles')
                        .set(authHeader)
                        .field('profileName', 'joe')
                    expect(response.status).toBe(400);
                    expect(response.body.error).toEqual('Maximum number of profiles have been created');
                });
            });
        });
    });

    describe("GET /current/profiles/:profileId   Profile Retrieval", () => {
    });

    describe("PATCH /current/profiles/:profileId   Profile Update", () => {
    });

    describe("DELETE /current/profiles/:profileId   Profile Delete", () => {
    });

    describe("PATCH /current/new-billing-date   Update Billing Date", () => {
    });

    describe("PATCH /current/subscription   Update Payment Method", () => {
    });
});