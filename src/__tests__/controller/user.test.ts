import supertest from 'supertest';
import app from '../../app';
import jwtTokenGenerator from '../../utils/jwt.generator';
import { db } from '../../db';
import { after } from 'node:test';


const testEmail = 'zsombor1.hajzer@gmail.com';

const token = jwtTokenGenerator('24h', 'email', testEmail, 'purpose', 'authentication'); // Provide valid string arguments here

const authHeader = {
    Authorization: `Bearer ${token}`
};

//TODO: Also check for auth header error messages by not submitting auth header or by submitting malformed jwt token
//TODO: I can also check for wrong request method for testing

describe('Rountes: /user ', () => {

    describe("DELETE /current Delete Profiles", () => {

        //Delete All existing profiles and create one to standardize test cases
        beforeAll(async () => {
            await db.none('DELETE FROM profile WHERE account_id = (SELECT account_id FROM account WHERE email = $1)', [testEmail]);

            await supertest(app)
                .post('/user/current/profiles')
                .set(authHeader)
                .field('profileName', 'joe');
        });

        describe("Successful Profile Deletions", () => {

            //Create a new profile before each so there is always something to delete
            beforeEach(async () => {
                await supertest(app)
                    .post('/user/current/profiles')
                    .set(authHeader)
                    .field('profileName', 'joe');
            });

            test('Valid Data Input, Successful Deletion, returns 200', async () => {
                const randomProfile = await db.one('SELECT * FROM profile WHERE account_id = (SELECT account_id FROM account WHERE email = $1) ORDER BY profile_id DESC LIMIT 1', [testEmail]);
                const response = await supertest(app)
                    .delete(`/user/current/profiles/${randomProfile.profile_id}`)
                    .set(authHeader)
                expect(response.status).toBe(200)
                expect(response.body.message).toBe('Profile deleted successfully')
            });
        });

        describe("Unsuccessful Profile Deletions", () => {

            test('Profile ID is Not A Number, string, expects 400 and error message', async () => {
                const response = await supertest(app)
                    .delete(`/user/current/profiles/NotANumber`)
                    .set(authHeader)
                expect(response.status).toBe(400)
                expect(response.body.error).toBe('Profile ID must be a number')
            });

            test('Invalid Input values, negative number, expect 400 and error message', async () => {
                const response = await supertest(app)
                    .delete(`/user/current/profiles/-213`)
                    .set(authHeader)
                expect(response.status).toBe(400)
                expect(response.body.error).toBe('Invalid input values')
            });

            test('Invalide authorization header token, expects 401 and error message', async () => {
                const response = await supertest(app)
                    .delete(`/user/current/profiles/1`)
                    .set({ Authorization: 'Malformed token' })
                expect(response.status).toBe(401)
                expect(response.body.error).toBe('Malformed or Invalid JWT token')
            });

            test('Invalide authorization header token, invalid email emmbedded in the token, expects 401 and error message', async () => {
                const response = await supertest(app)
                    .delete(`/user/current/profiles/1`)
                    .set({ Authorization: jwtTokenGenerator('24h', 'email', "test@gmail.com", 'purpose', 'authentication') })
                console.log(response.header)
                expect(response.status).toBe(401)
                expect(response.body.error).toBe('User not found in the database')
            });

            test('Invalide authorization header token, Invalid purpose token embedding, expects 401 and error message', async () => {
                const response = await supertest(app)
                    .delete(`/user/current/profiles/1`)
                    .set({ Authorization: jwtTokenGenerator('24h', 'email', "test@gmail.com", 'purpose', 'no authentication') })
                console.log(response.header)
                expect(response.status).toBe(401)
                expect(response.body.error).toBe('Not Authorized')
            });

            test('Profile Not found, wrong profile number, expects 400 and error message', async () => {
                const response = await supertest(app)
                    .delete(`/user/current/profiles/999999999`)
                    .set(authHeader)
                expect(response.status).toBe(404)
                expect(response.body.error).toBe('Profile not found')
            });

            test('Incorrect request method, PUT request, expects status code and error message', async () => {
                const response = await supertest(app)
                    .put(`/user/current/profiles/1`)
                    .set(authHeader)
                expect(response.status).toBe(404)
                expect(response.body.error).toBe('Invalid route')
            });

            describe('Profile ID and authorization header token missmatch', () => {
                let otherAccountProfile: any = null;

                //Insert a new account & profile directly into db to test the case
                beforeAll(async () => {
                    await db.none(`INSERT INTO Account (email, password, first_name, last_name, active_subscription, blocked, verified, street, zip_code, country_id, log_in_attempt_count, invited, user_type) 
                    VALUES ($<email>, $<password>, $<first_name>, $<last_name>, 
                    $<active_subscription>, $<blocked>, $<verified>, $<street>, $<zip_code>,
                    $<country_id>, $<log_in_attempt_count>, $<invited>, $<user_type>)`, {
                        email: "test@gmail.com",
                        password: "hashedPassword",
                        first_name: "firstName",
                        last_name: "lastName",
                        active_subscription: false,
                        blocked: false,
                        verified: false,
                        street: "street",
                        zip_code: "zipCode",
                        country_id: 5,
                        log_in_attempt_count: 0,
                        invited: false,
                        user_type: 'User'
                    });

                    const createdProfile = await db.one(`INSERT INTO Profile (account_id, profile_name, age, language, profile_image, preferences) 
                    VALUES ((SELECT account_id FROM account WHERE email = $<email>), $<profile_name>, $<age>, $<language>, $<profile_image>, $<preferences>) RETURNING *`, {
                        email: "test@gmail.com",
                        profile_name: "testProfile",
                        age: 25,
                        language: "en",
                        profile_image: "profilePicture",
                        preferences: {
                            movie: [],
                            series: [],
                            min_age: [],
                            viewing_class: []
                        }
                    });
                    otherAccountProfile = createdProfile;
                });

                //Delete the account after testing to not affect other tests
                afterAll(async () => {
                    await db.none('DELETE FROM account WHERE email = $<email>',
                        { email: "test@gmail.com" });
                });

                test('Unauthorized profile deletion: Profile ID does not match the account credentials, expects 401 and error message', async () => {
                    const response = await supertest(app)
                        .delete(`/user/current/profiles/${otherAccountProfile.profile_id}`)
                        .set(authHeader)
                    expect(response.status).toBe(401)
                    expect(response.body.error).toBe('Unauthorized')
                });
            });
        });
    });

    describe("POST /current/profiles  Profile Creation", () => {

        //Delete All existing profiles and create one to not standardize test cases
        beforeAll(async () => {
            await db.none('DELETE FROM profile WHERE account_id = (SELECT account_id FROM account WHERE email = $1)', [testEmail]);

            await supertest(app)
                .post('/user/current/profiles')
                .set(authHeader)
                .field('profileName', 'joe');
        });

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

            test('Invalid accept-langauge has special characters, should return 400', async () => {
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

        describe("Successful Profile Retrieval", () => {

            test('Valid profile request', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

        });

        describe("Unsuccessful Profile Retrieval", () => {

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });
        });

    });

    describe("PATCH /current/profiles/:profileId   Profile Update", () => {

        describe("Successful Profile Update", () => {

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });
        });

        describe("Unsuccessful Profile Update", () => {

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });
        });

    });

    describe("DELETE /current/profiles/:profileId   Account Delete", () => {

        describe("Successful Account Deletion", () => {

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

        });

        describe("Unsuccessful Account Deletion", () => {

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

        });
    });

    describe("PATCH /current/new-billing-date  Update Billing Date", () => {

        describe("Successful Billing Date Update", () => {

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });
        });

        describe("Unsuccessful Billing Date Update", () => {

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });
        });
    });

    describe("PATCH /current/subscription   Update Payment Method", () => {

        describe("Successful Payment Method Update", () => {

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });
        });

        describe("Unsuccessful Payment Method Update", () => {

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });

            test('', async () => {
            });
        });
    });
});