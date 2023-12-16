import responder from "../utils/responder";
import express, { Router, Request, Response } from "express";
import { db } from '../db'
import { User } from "../types/user";
import { isValidEmail } from "../utils/email.pass.validators";
import jwtTokenGenerator from "../utils/jwt.generator";
import sendEmail from "../utils/email.sender";


export const postCreateNewProfile = async (req: Request & { user?: User }, res: Response): Promise<void> => {

    const profileName: string = req.body.profileName;
    const age: number = (req.body.age !== null && req.body.age >= 0) ? req.body.age : 0  //make sure the age is not negative && it exists, otherwise null
    let language: string = req.headers['accept-language'] ? req.headers['accept-language'] : 'en'  // check for language, 
    let profile_image: string | null = req.file ? req.file.filename : null;


    //? Does the language header need to be validated? To make sure that the user does not use a self made header there? If so, how since there is like a 100+ accept langauge values
    //? This also makes me question on what data should be validated and what is okay. 
    //? param? query? body? header? do i need to validate all of this?
    //? Also what needs to be validated, is submitting an empty string not allowed? 

    if (!profileName || profileName.trim() === '') {
        responder(res, 400, 'error', 'Invalid profileName');
        return;
    }

    //Make sure that if the languages have multiple inputs take the first one before the comma
    if (language.includes(",")) {
        const preferredLanguage: string[] = language.split(',')
        language = preferredLanguage[0].trim();
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
};


export const patchUpdateProfile = async (req: Request, res: Response): Promise<void> => {
};


export const deleteDeleteProfile = async (req: Request, res: Response): Promise<void> => {

};

export const postSetProfilePreferences = async (req: Request, res: Response): Promise<void> => {
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

    if (isNaN(Number(profile_id))) {
        responder(res, 400, 'error', 'Profile ID must be a number');
        return;
    }

    if (!series.every(item => typeof item === 'string' && item.trim() !== '')) {
        responder(res, 400, 'error', 'All items in series must be none empty strings');
        return;
    }

    if (!movie.every(item => typeof item === 'string' && item.trim() !== '')) {
        responder(res, 400, 'error', 'All items in movies must be none empty strings');
        return;
    }

    if (!genres.every(item => typeof item === 'string' && item.trim() !== '')) {
        responder(res, 400, 'error', 'All items in genres must be none empty strings');
        return;
    }

    if (!viewing_class.every(item => typeof item === 'string' && item.trim() !== '' && allowedViewingClasses.includes(item.trim()))) {
        responder(res, 400, 'error', 'All items in viewing_class must be none empty strings');
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

        const updatedPreferences: { [key: string]: string[] } =
        {
            "movie": movie,
            "series": series,
            "genres": genres,
            "viewing_class": viewing_class,
            "min_age": [String(min_age)]
        }

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

export const postSendInvitation = async (req: Request & {user? : User}, res: Response): Promise<void> => {
    
    const email: string = req.body.email;

    if (!req.body.email) {
        responder(res, 400, 'error', 'Email is required');
        return;
    }

   if (!isValidEmail(email)) {
        responder(res, 400, 'error', 'Invalid email', `err`, `${email} is not a valid email`);
        return;
    }

    try {
        //! DB CONNECTION HERE -----------------------------------------------------------------------------------
        const account = await db.oneOrNone('SELECT * FROM Account WHERE email = ${email}', {
            email: email
        });

        if (account) {
            responder(res, 400, 'error', 'Account is already registered');
            return;
        }

        const token: string = jwtTokenGenerator('24h','invitingEmail',req.user?.email!, 'invitedEmail', email, 'purpose', 'invite')
        try {
            const info =  await sendEmail(email, 'Invitation to join Netflix', `register/invitation/`, token, 'to register an account and get 2 euro off')
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
