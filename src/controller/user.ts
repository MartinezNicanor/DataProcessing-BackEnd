import responder from "../utils/responder";
import express, { Router, Request, Response } from "express";
import { db } from '../db'
import { User } from "../types/user";


export const postCreateNewProfile = async (req: Request & { user?: User }, res: Response): Promise<void> => {

    const profileName: string = req.body.profileName;
    const age: number | null = (req.body.age !== null && req.body.age >= 0) ? req.body.age : null  //make sure the age is not negative && it exists, otherwise null
    let language: string = req.headers['accept-language'] ? req.headers['accept-language'] : 'en'  // check for language, 
    let profilePictureFilename: string | null = req.file ? req.file.filename : null;
    const accountIdParam = req.params.accountId

    //Make sure the accountID and the url accountId matches
    if(accountIdParam !== String(req.user?.account_id)){
        responder(res, 401, 'error', 'User unauthorized')
        return;
    }

    //Make sure that if the languages have multiple inputs take the first one before the comma
    if(language.includes(",")){
        const preferredLanguage: string[] = language.split(',')
        language = preferredLanguage[0].trim();
    }

    try {
        //Check how many profiles does a user already have
        //! DB CONNECTION HERE -----------------------------------------------------------------------------------
        const numberOfProfiles = await db.oneOrNone('SELECT COUNT(*) FROM profile WHERE account_id = ${account_id}', {
            account_id: req.user?.account_id,
        });

        //If 4 or more respond with an error
        if (numberOfProfiles >= 4) {
            responder(res, 400, 'error', 'Maximum number of profiles have been created');
            return;
        }

        //Check if file was uploaded
        if (req.file) {
            profilePictureFilename = req.file.filename;
            console.log("File uploaded successfully")
        } else {
            // If no file was uploaded, set a default or placeholder profile picture filename
            profilePictureFilename = 'default'; 
        }

        //Insert the user information into DB
        //! DB CONNECTION HERE -----------------------------------------------------------------------------------
        await db.none('INSERT INTO profile (account_id, profile_name, profile_picture_filename, age, language) VALUES (${account_id}, ${profileName}, ${profilePictureFilename}, ${age}, ${language})', {
            account_id: req.user?.account_id,
            profileName: profileName,
            profilePictureFilename: profilePictureFilename,
            age: age, 
            langauge: language
        });

        //Successful response
        responder(res, 201, 'message', 'Profile created successfully');
        return;
    } catch (err) {
        //DB connect problem
        responder(res, 500, 'error', 'Internal Server Error');
        return;
    }
};


export const getUserProfile = async (req: Request & { user?: User }, res: Response): Promise<void> => { 
    
    
    const accountIdParam: string = req.params.accountId
    const profileIdParam: string = req.params.profileId

    //Check if user is the correct one
    if(accountIdParam !== String(req.user?.account_id)){
        responder(res, 401, 'error', 'User unauthorized')
        return;
    }

    try {
        //! DB CONNECTION HERE -----------------------------------------------------------------------------------
        //Get the profile info where accountId and profileId matches
        const userProfile = await db.oneOrNone('SELECT * FROM profile WHERE account_id = ${account_id} AND profile_id = ${profile_id}', {
            account_id : accountIdParam,
            profile_id : profileIdParam
        })

        //If no match return error message
        if(!userProfile) {
            responder(res, 400, 'error', 'Profile id not found')
            return;
        }

        //TODO: Makes sure the user profile information is sent properly becuae right now im not sure how this would be formatted
        responder(res, 200, 'Message', 'UserProfile retireved successfully', 'userProfile', userProfile)
        return;

    } catch (err){
        responder(res, 500, 'error', 'Internal Server Error')        
        return;
    }
};


export const patchUpdateProfile = async (req: Request, res: Response): Promise<void> => { 

};


export const deleteDeleteProfile = async (req: Request, res: Response): Promise<void> => { };

export const postSetProfilePreferences = async (req: Request, res: Response): Promise<void> => { };

export const patchUpdateProfilePreferences = async (req: Request, res: Response): Promise<void> => { };
