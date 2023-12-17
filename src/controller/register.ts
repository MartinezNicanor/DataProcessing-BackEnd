import { Request, Response } from 'express';
import { db } from '../db';
import * as bcrypt from 'bcryptjs';
import jwtTokenGenerator from '../utils/jwt.generator'
import sendMail from '../utils/email.sender';
import jwt from 'jsonwebtoken';
import { isValidEmail, isValidPassword, validateStrings, validateNumbers} from '../utils/validators'
import responder from '../utils/responder';

export const postRegisterUser = async (req: Request, res: Response): Promise<void> => {

  const email: string = req.body.email!;
  const password: string = req.body.password!;
  const firstName: string = req.body.firstName!;
  const lastName: string = req.body.lastName!;
  const paymentMethod: string = req.body.paymentMethod!;
  const subscriptionId: number = req.body.subscriptionId!;
  const street: string = req.body.street!;
  const zipCode: string = req.body.zipCode!;
  const countryId: number = req.body.countryId!;

  //TODO: Payment method validation for specific types only visa, mastercard, paypal, etc.

  // if(validateStrings([firstName, lastName, paymentMethod, street, zipCode]) === false) {
  //   responder(res, 400, 'error', 'Invalid input values');
  //   return;
  // }

  // if(validateNumbers([subscriptionId, countryId]) === false) {
  //   responder(res, 400, 'error', 'Invalid input values');
  //   return;
  // }

  //Validate email
  if (!isValidEmail(email)) {
    responder(res, 400, 'error', 'Invalid email address. Please make sure that the input values are valid.')
    return;
  }

  //Validate password
  if (!isValidPassword(password)) {
    responder(res, 400, 'error', 'Invalid password. Please make sure that the input values are valid')
    return;
  }

  //Check if email is already in DB
  try {
    //! DB CONNECTION HERE -----------------------------------------------------------------------------------
    const user: null | string = await db.oneOrNone('SELECT * FROM Account WHERE email = ${email}', {
      email: email
    });

    if (user) {
      responder(res, 401, 'error', 'Email address has already been registered')
      return;
    }

  } catch (err) {
    responder(res, 500, 'error', 'Internal Server Error')
    return;
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  //TODO: GO THROUGH SQL QUERY WITH JOEY WHEN HE IS DONE WITH DB
  try {
    //! DB CONNECTION HERE -----------------------------------------------------------------------------------
    await db.none(`INSERT INTO Account (email, password, first_name, last_name, payment_method,
      subscription_id, blocked, verified, street, zip_code, country_id, log_in_attempt_count, invited) 
      VALUES ($<email>, $<password>, $<first_name>, $<last_name>, $<payment_method>, $<subscription_id>,
      $<blocked>, $<verified>, $<street>, $<zip_code>, $<country_id>, $<log_in_attempt_count>, $<invited>)`, {
      email: email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      payment_method: paymentMethod,
      subscription_id: 1,
      blocked: false,
      verified: false,
      street: street,
      zip_code: zipCode,
      country_id: 1,
      log_in_attempt_count: 0,
      invited: false
    });

  } catch (err) {
    responder(res, 500, 'error', 'Something went wrong')
    return;
  }

  const token = jwtTokenGenerator('30m', 'email', email, 'purpose', 'account-verification');

  //send email
  try {
    const info = await sendMail(email, 'Account Verification', 'register/verification/', token, 'Verify Your account! This link is valid for 30 min');
    console.log('Email sent: ', info.response);

    responder(res, 201, 'message', 'Register successfull, verification email sent')
    return;
  } catch (err) {
    responder(res, 500, 'error', 'Error sending email')
    return;
  }
};

// Account verification logic
export const getVerifyUser = async (req: Request, res: Response): Promise<void> => {

  //get token from url
  const token: string = req.params.token!;

  if (token === undefined) {
    responder(res, 400, 'error', 'Invalid Request')
    return
  }

  //verify token and activate account in db
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    const userData: jwt.JwtPayload = decodedToken.data;
    const email: string = userData['email'];

    //verify that the user did not insert an authorization token into the url or something else
    if (userData['purpose'] !== 'account-verification') {
      responder(res, 401, 'error', 'Incorrect JWT token');
      return;
    }

    //validate email
    if (!isValidEmail(email)) {
      responder(res, 400, 'error', 'Invalid email address. Please make sure that the input values are valid.')
      return;
    }

    try {
      // ! DB CONNECTION HERE -----------------------------------------------------------------------------------
      const invitedObject = await db.oneOrNone('SELECT * FROM Invite WHERE invited_email = ${invitedEmail}', {
        invitedEmail: email
      });
      if (invitedObject) {
        //If there is an invited object, execute the following logic db queries in a transaction:
        //Update inviting user to have invited = true
        //Delete invite object from db
        //Update invited user to have invited = true and verified = true
        try {
          await db.tx(async (t) => {
            // Update inviting user to have invited = 
            //! DB CONNECTION HERE -----------------------------------------------------------------------------------
            await t.none('UPDATE Account SET invited = $<invited> WHERE email = $<email>', {
              invited: true,
              email: invitedObject.inviting_email
              });

              //! DB CONNECTION HERE -----------------------------------------------------------------------------------
            await t.none('UPDATE Account SET invited = $<invited>, verified = $<verified> WHERE email = $<email>', {
              invited: true,
              verified: true,
              email: email
              });

           //! DB CONNECTION HERE -----------------------------------------------------------------------------------
            await t.none('DELETE FROM Invite WHERE invited_email = $<email>', {
              email: invitedObject.invited_email
              });
          });
          responder(res, 200, 'message', 'Account verified successfully');
          return
        } catch (err) {
          responder(res, 500, 'error', 'Internal Server Error');
          return
        }

        /* If there is an invited object, update the invited column in the Account table to true for the inviting 
        user and delete the invite object from the Invite table and  */ 
      }

      //If there is no invited object, execute the following just update the verified column in the Account table to true
      try {
        //! DB CONNECTION HERE -----------------------------------------------------------------------------------
        await db.none('UPDATE Account SET verified = $<verified> WHERE email = $<email>', {
          verified: true,
          email: email
        })
        responder(res, 200, 'message', 'Account verified successfully')
        return;
      } catch (err) {
        responder(res, 500, 'error', 'Internal Server Error')
        return;
      }
    } catch (error) {
      responder(res, 500, 'error', 'Internal Server Error')
      return;
    }
    //If everything is okay, send good response
  }
  catch (err: any) {

    if (err.name === 'TokenExpiredError') {
      responder(res, 401, 'error', 'Expired Link');
      return;
    } else {
      responder(res, 401, 'error', 'JWT malformed')
      return;
    }
  }
};

// Invitation logic if they click on the link in the email they get added to a db table. 
// This db table is checked when they register and if they are in the table they get a discount
export const getInvitedUser = async (req: Request, res: Response): Promise<void> => {

  // get token from url
  const token: string = req.params.token!;

  //make sure token is not undefined
  if (token === undefined) {
    responder(res, 400, 'error', 'Invalid Request');
    return;
  }

  // verify token and activate account in db
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    const userData: jwt.JwtPayload = decodedToken.data;
    const invitedEmail: string = userData['invitedEmail'];
    const invitingEmail: string = userData['invitingEmail'];

    // verify that the user did not insert an authorization token into the url or something else
    if (userData['purpose'] !== 'invite') {
      responder(res, 401, 'error', 'Incorrect JWT token');
      return;
    }

    // validate emails
    if (!isValidEmail(invitedEmail) || !isValidEmail(invitingEmail)) {
      responder(res, 400, 'error', 'Invalid email address. Please make sure that the input values are valid.');
      return;
    }

    // check if invited email is the same as inviting email
    if (invitedEmail === invitingEmail) {
      responder(res, 400, 'error', 'You cannot invite yourself');
      return;
    }

    try {
      // ! DB CONNECTION HERE -----------------------------------------------------------------------------------
      // check if invited email is already registered
      const user: null | string = await db.oneOrNone('SELECT * FROM Account WHERE email = ${email}', {
        email: invitedEmail
      });

      // if invited email is already registered, send error
      if (user) {
        responder(res, 401, 'error', 'Email address has already been registered');
        return;
      }

      if (!user) {
        try {
          // ! DB CONNECTION HERE -----------------------------------------------------------------------------------
          // check if invited email is already invited by the same user
          const inviteObject = await db.oneOrNone('SELECT * FROM Invite WHERE invited_email = ${invitedEmail} AND inviting_email = ${invitingEmail}', {
            invitedEmail: invitedEmail,
            invitingEmail: invitingEmail
          });

          // if invited email is already invited by the same user do nothing and send success message
          if (inviteObject) {
            responder(res, 200, 'message', 'User Invited Successfully');
            return;
          }

          // if invited email is not already invited by the same user, add it to the db
          if (inviteObject === null) {
            try {
              // ! DB CONNECTION HERE -----------------------------------------------------------------------------------
              await db.none(`INSERT INTO Invite (invited_email, inviting_email) VALUES ($<invitedEmail>, $<invitingEmail>)`, {
                invitedEmail: invitedEmail,
                invitingEmail: invitingEmail
              });
              responder(res, 200, 'message', 'User invited successfully');
              return;
            } catch (err) {
              responder(res, 500, 'error', 'Internal Server Error');
              return;
            }
          }
        } catch (err) {
          responder(res, 500, 'error', 'Internal Server Error');
          return;
        }
      }
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        responder(res, 401, 'error', 'Expired Link');
        return;
      } else {
        responder(res, 401, 'error', 'JWT malformed');
        return;
      }
    }
  } catch (err: any) {
    responder(res, 500, 'error', 'Internal Server Error');
    return;
  }
};

