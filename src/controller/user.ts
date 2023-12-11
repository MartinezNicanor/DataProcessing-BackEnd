import responder from "../utils/responder";
import express, { Router, Request, Response } from "express";
import { db } from '../db'
import { User } from "../types/user";


export const postCreateNewProfile = async (req: Request & { user?: User }, res: Response): Promise<void> => {
    const profileName: string = req.body.profileName;
    let profilePictureFilename: string | null = req.file ? req.file.filename : null;
  
    try {
      const numberOfProfiles = await db.oneOrNone('SELECT COUNT(*) FROM profile WHERE account_id = ${account_id}', {
        account_id: req.user?.account_id,
      });
  
      if (numberOfProfiles >= 4) {
        responder(res, 400, 'error', 'Maximum number of profiles have been created');
        return;
      }
  
      if (req.file) {
        profilePictureFilename = req.file.filename;
        console.log("File uploaded successfully")
      } else {
        // If no file was ed, uploadset a default or placeholder profile picture filename
        profilePictureFilename = 'default.jpeg'; // Adjust the default picture filename
      }
  
      await db.none('INSERT INTO profile (account_id, profile_name, profile_picture_filename) VALUES (${account_id}, ${profileName}, ${profilePictureFilename})', {
        account_id: req.user?.account_id,
        profileName: profileName,
        profilePictureFilename: profilePictureFilename,
      });
  
      responder(res, 201, 'message', 'Profile created successfully');
      return;
    } catch (err) {
      responder(res, 500, 'error', 'Internal Server Error');
      return;
    }
  };
  
//Count the number of profiles which have the same number of account_id

export const getUserProfile = async (req: Request, res: Response): Promise<void> => { };


export const patchUpdateProfile = async (req: Request, res: Response): Promise<void> => { };


export const deleteDeleteProfile = async (req: Request, res: Response): Promise<void> => { };