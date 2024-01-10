import responder from "../utils/responder";
import express, { Router, Request, Response } from "express";
import { db } from '../db'
import { User } from "../types/user";
import { isValidEmail, validateStrings, validateNumbers, validateArrayStrings } from "../utils/validators";
import jwtTokenGenerator from "../utils/jwt.generator";
import sendEmail from "../utils/email.sender";


export const postCreateNewProfile = async (req: Request & { user?: User }, res: Response): Promise<void> => {

    const profileName: string = req.body.profileName;
    const age: number = (req.body.age !== null && req.body.age >= 0) ? req.body.age : 0  //make sure the age is not negative && it exists, otherwise null
    let language: string = req.headers['accept-language'] ? req.headers['accept-language'] : 'en'  // check for language, 
    let profile_image: string | null = req.file ? req.file.filename : null;

    //Make sure that if the languages have multiple inputs take the first one before the comma
    if (language.includes(",")) {
        const preferredLanguage: string[] = language.split(',')
        language = preferredLanguage[0].trim();
    }

    //validate input values
    if (validateStrings([profileName, language]) === false) {
        responder(res, 400, 'error', 'Invalid input values');
        return;
    }

    //validate input values
    if (validateNumbers([age]) === false) {
        responder(res, 400, 'error', 'Invalid input values');
        return;
    }

    try {
        //Check how many profiles does a user already have
        //! DB CONNECTION HERE -----------------------------------------------------------------------------------
        const numberOfProfiles = await db.oneOrNone('SELECT COUNT(*) FROM Profile WHERE account_id = ${account_id}', {
            account_id: req.user?.account_id,
        });

        //If 4 or more respond with an error
        if (numberOfProfiles.count >= 4) {
            responder(res, 400, 'error', 'Maximum number of profiles have been created');
            return;
        }

        //Check if file was uploaded
        if (req.file) {
            profile_image = req.file.filename;
            console.log("File uploaded successfully")
        } else {
            // If no file was uploaded, set a default or placeholder profile picture filename
            profile_image = 'default';
        }

        //Insert the user information into DB
        //! DB CONNECTION HERE -----------------------------------------------------------------------------------
        try {
            await db.none('INSERT INTO profile (account_id, profile_name, profile_image, age, language) VALUES ($<account_id>, $<profileName>, $<profile_image>, $<age>, $<language>)', {
                account_id: req.user?.account_id,
                profileName: profileName,
                profile_image: profile_image,
                age: age,
                language: language
            });

            // Successful insertion
            responder(res, 201, 'message', 'Profile created successfully');
            return;
        } catch (err) {
            // Log the error for debugging
            responder(res, 500, 'error', 'Internal Server Error');
            return;
        }
    } catch (err) {
        //DB connect problem
        responder(res, 500, 'error', 'Internal Server Error');
        return;
    }
};


export const getUserProfile = async (req: Request & { user?: User }, res: Response): Promise<void> => {
    const profile_id: string = req.params.profileId!;

    //Check if profile id is a valid string number
    if (isNaN(Number(profile_id))) {
        responder(res, 400, 'error', 'Profile ID must be a number');
        return;
    }

    //validate input values
    if (validateNumbers([Number(profile_id)]) === false) {
        responder(res, 400, 'error', 'Invalid input values');
        return;
    }

    try {
        //! DB CONNECTION HERE -----------------------------------------------------------------------------------
        const profile = await db.oneOrNone('SELECT * FROM Profile WHERE profile_id = ${profile_id}', {
            profile_id: profile_id
        });

        if (!profile) {
            responder(res, 404, 'error', 'Profile not found');
            return;
        }

        if (profile.account_id !== req.user?.account_id) {
            responder(res, 401, 'error', 'Unauthorized');
            return;
        }

        responder(res, 200, 'data', profile);
        return;
    } catch (err) {
        responder(res, 500, 'error', 'Internal Server Error');
        return;
    }
};


export const patchUpdateProfile = async (req: Request & { user?: User }, res: Response): Promise<void> => {

    //profile interface to organize the data
    interface Profile {
        profile_id: number,
        account_id: number,
        profile_name: string,
        profile_image: string,
        age: number,
        language: string,
    }

    //Get the data from the request
    const profile_id: string = req.params.profileId!;
    let profileName: string = req.body.profileName!;
    let age: number = (req.body.age !== null && req.body.age >= 0) ? req.body.age : 0  //make sure the age is not negative && it exists, otherwise null
    let language: string = req.headers['accept-language'] ? req.headers['accept-language'] : 'en'  // check for language, 
    let profile_image: string | null = req.file ? req.file.filename : null;

    //Make sure that if the languages have multiple inputs take the first one before the comma
    if (language.includes(",")) {
        const preferredLanguage: string[] = language.split(',')
        language = preferredLanguage[0].trim();
    }

    //validate strings
    if (validateStrings([profileName, language]) === false) {
        responder(res, 400, 'error', 'Invalid input values');
        return;
    }

    //Check if profile id is a valid string number
    if (isNaN(Number(profile_id))) {
        responder(res, 400, 'error', 'Profile ID must be a number');
        return;
    }

    //validate numbers values
    if (validateNumbers([Number(profile_id), age]) === false) {
        responder(res, 400, 'error', 'Invalid input values');
        return;
    }

    //get profile from db
    try {
        //! DB CONNECTION HERE -----------------------------------------------------------------------------------
        const profile: Profile | null = await db.oneOrNone('SELECT * FROM Profile WHERE profile_id = ${profile_id} AND account_id = ${account_id}', {
            profile_id: profile_id,
            account_id: req.user?.account_id
        });

        //Check if profile exists
        if (!profile) {
            responder(res, 404, 'error', 'Profile not found');
            return;
        }

        //Check which parts of the profile was set to be updated
        if (req.file) {
            profile_image = req.file.filename;
            console.log("File uploaded successfully")
        } else {
            profile_image = profile.profile_image;
        }

        if (profileName === '') {
            profileName = profile.profile_name;
        }

        if (age === 0) {
            age = profile.age;
        }

        if (language === 'en') {
            language = profile.language;
        }

        //Update the profile
        try {
            //! DB CONNECTION HERE -----------------------------------------------------------------------------------
            await db.none('UPDATE Profile SET profile_name = $<profileName>, profile_image = $<profile_image>, age = $<age>, language = $<language> WHERE profile_id = $<profile_id>', {
                profileName: profileName,
                profile_image: profile_image,
                age: age,
                language: language,
                profile_id: profile_id
            });

            responder(res, 200, 'message', 'Profile updated successfull');
        } catch (err) {
            responder(res, 500, 'error', 'Internal Server Error');
            return;
        }
    } catch (err) {
        responder(res, 500, 'error', 'Internal Server Error');
        return;
    }
};


export const deleteDeleteProfile = async (req: Request & { user?: User }, res: Response): Promise<void> => {

    const profile_id: string = req.params.profileId!;

    //Check if profile id is a valid string number
    if (isNaN(Number(profile_id))) {
        responder(res, 400, 'error', 'Profile ID must be a number');
        return;
    }

    //validate input values
    if (validateNumbers([Number(profile_id)]) === false) {
        responder(res, 400, 'error', 'Invalid input values');
        return;
    }

    //get profile from db
    try {
        //! DB CONNECTION HERE -----------------------------------------------------------------------------------
        const profile = await db.oneOrNone('SELECT * FROM Profile WHERE profile_id = ${profile_id} AND account_id = ${account_id}', {
            profile_id: profile_id,
            account_id: req.user?.account_id
        });

        //Check if profile exists
        if (!profile) {
            responder(res, 404, 'error', 'Profile not found');
            return;
        }

        //Delete the profile
        try {
            //! DB CONNECTION HERE -----------------------------------------------------------------------------------
            await db.none('DELETE FROM Profile WHERE profile_id = ${profile_id}', {
                profile_id: profile_id
            });

            responder(res, 200, 'message', 'Profile deleted successfully');
            return;
        } catch (err) {
            responder(res, 500, 'error', 'Internal Server Error');
            return;
        }
    } catch (err) {
        responder(res, 500, 'error', 'Internal Server Error');
        return;
    }
};

export const patchUpdateProfilePreferences = async (req: Request & { user?: User }, res: Response): Promise<void> => {

    const profile_id: string = req.params.profileId!;
    const movie: string[] = req.body.movies ? req.body.movies : [];
    const series: string[] = req.body.series ? req.body.series : [];
    const genres: string[] = req.body.genres ? req.body.genres : [];
    const min_age: number = (req.body.min_age !== null && req.body.min_age >= 0) ? req.body.min_age : 0
    const viewing_class: string[] = req.body.viewing_class ? req.body.viewing_class : [];

    const allowedViewingClasses = ['All ages', '6', '9', '12', '16+', 'violence', 'sex', 'terror', 'discrimination', 'drug and alcohol abuse', 'coarse language']

    if (!req.params.profileId) {
        responder(res, 400, 'error', 'Profile ID is required');
        return;
    }

    //Check if profile id is a number req.params is always string
    if (isNaN(Number(profile_id))) {
        responder(res, 400, 'error', 'Profile ID must be a number');
        return;
    }

    //validate input values
    if (validateNumbers([min_age, Number(profile_id)]) === false) {
        responder(res, 400, 'error', 'Invalid input values');
        return;
    }

    //validate input values crazy array validation
    if (validateArrayStrings([movie, series, genres]) === false || (validateArrayStrings([viewing_class]) === false) && viewing_class.every(item => allowedViewingClasses.includes(item.trim())) === false) {
        responder(res, 400, 'error', 'Invalid input values');
        return;
    }

    //get profile from db
    try {
        //! DB CONNECTION HERE -----------------------------------------------------------------------------------
        const profile = await db.oneOrNone('SELECT * FROM Profile WHERE profile_id = ${profile_id} AND account_id = ${account_id}', {
            profile_id: profile_id,
            account_id: req.user?.account_id
        });

        //Check if profile exists
        if (!profile) {
            responder(res, 404, 'error', 'Profile not found');
            return;
        }

        //Update the profile preferences
        const updatedPreferences: { [key: string]: string[] } =
        {
            "movie": movie,
            "series": series,
            "genres": genres,
            "viewing_class": viewing_class,
            "min_age": [String(min_age)]
        }

        //Update the profile
        try {
            //! DB CONNECTION HERE -----------------------------------------------------------------------------------
            await db.none('UPDATE Profile SET preferences = $<updatedPreferences> WHERE profile_id = $<profile_id>', {
                updatedPreferences: updatedPreferences,
                profile_id: profile_id
            });

            responder(res, 200, 'message', 'Profile preferences updated successfully');
            return;
        } catch (err) {
            responder(res, 500, 'error', 'Internal Server Error');
            return;
        }

    } catch (err) {
        responder(res, 500, 'error', 'Internal Server Error');
        return;
    }
};

export const postSendInvitation = async (req: Request & { user?: User }, res: Response): Promise<void> => {

    const email: string = req.body.email!;

    //validate input values
    if (!isValidEmail(email)) {
        responder(res, 400, 'error', 'Invalid email', `err`, `${email} is not a valid email`);
        return;
    }

    //Check if the email is already registered
    try {
        //! DB CONNECTION HERE -----------------------------------------------------------------------------------
        const account = await db.oneOrNone('SELECT * FROM Account WHERE email = ${email}', {
            email: email
        });

        //If the email is already registered
        if (account) {
            responder(res, 400, 'error', 'Account is already registered');
            return;
        }

        //Generate the token
        const token: string = jwtTokenGenerator('24h', 'invitingEmail', req.user?.email!, 'invitedEmail', email, 'purpose', 'invite')

        //Send the email
        try {
            const info = await sendEmail(email, 'Invitation to join Netflix', `register/invitation/`, token, 'to register an account and get 2 euro off')
            console.log('Email sent: ', info.response);
            responder(res, 200, 'message', 'Invitation sent successfully');
            return;
        } catch (error) {
            responder(res, 500, 'error', 'Internal Server Error');
            return;
        }
    } catch (err) {
        responder(res, 500, 'error', 'Internal Server Error');
        return;
    }
};

export const deleteDeleteUserAccount = async (req: Request & { user?: User }, res: Response): Promise<void> => {
    //Delete the account
    try {
        //! DB CONNECTION HERE -----------------------------------------------------------------------------------
        //transaction to delete the account and the profiles associated with the account
        await db.tx(async (t) => {
            await t.none('DELETE FROM Profile WHERE account_id = ${account_id}', {
                account_id: req.user?.account_id
            });
            await t.none('DELETE FROM Account WHERE account_id = ${account_id}', {
                account_id: req.user?.account_id
            });
        });
        responder(res, 200, 'message', 'Account deleted successfully');
        return;
    } catch (err) {
        responder(res, 500, 'error', 'Internal Server Error');
        return;
    }
}