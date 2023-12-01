import { Request, Response } from 'express';
import { db } from '../db';
import * as bcrypt from 'bcryptjs';


//TODO: Register -> Check for valid register info, -> Check if user exists(email) -> Generate JWT token -> Send Email 
export const postRegisterUser = async (req: Request, res: Response): Promise<void> => {

    const email : string = req.body.email;
    const password : string = req.body.password;

    //Validate email
    if (!isValidEmail(email)) {
        res.status(400).json({
          error: "Invalid email address. Please make sure that the input values are valid."
        });
        return;
      }
    
    //Validate password
    if (!isValidPassword(password)) {
        res.status(400).json({
          error: "Invalid password. Please make sure that the input values are valid."
        });
        return;
      }

    //Check if email is already in DB
    try {
        const data: null | string = await db.oneOrNone('SELECT * FROM account WHERE email = ${email}', {
            email: email
        });
    
        if (data) {
            res.status(409).json({
                error: "Email address has already been registered"
            });
            return;
        }
    
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal Server Error"
        });
        return;
    }

    //hash password
    
  const hashedPassword = await bcrypt.hash(password, 10);


  res.status(200).json({
    message: `Register is working and email is ${email} and password is ${password} and the hasehdPassword is : ${hashedPassword}`,
  });
};


function isValidEmail(email: string): Boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  //! DONT FORGET TO REMOVE THE PASSOWORD OPTION WHICH IS FOR TESTING
function isValidPassword(password: string): Boolean {
    //regex for One capital, one lowercase letter one number, one special character and at least 6 characters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if(password == "password"){
        return true;
    }
    return passwordRegex.test(password);
}