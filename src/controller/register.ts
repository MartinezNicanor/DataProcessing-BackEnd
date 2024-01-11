import { Request, Response } from 'express';
import { db } from '../db';
import * as bcrypt from 'bcryptjs';
import jwtTokenGenerator from '../utils/jwt.generator'
import sendMail from '../utils/email.sender';
import jwt from 'jsonwebtoken';
import { isValidEmail, isValidPassword, validateStrings, validateNumbers } from '../utils/validators'
import responder from '../utils/responder';

export const postRegisterUser = async (req: Request, res: Response): Promise<void> => {

  const email: string = req.body.email!;
  const password: string = req.body.password!;
  const firstName: string = req.body.firstName!;
  const lastName: string = req.body.lastName!;
  const street: string = req.body.street!;
  const zipCode: string = req.body.zipCode!;
  const countryId: number = req.body.countryId!;

  let age: number = (req.body.age !== null && req.body.age >= 0) ? req.body.age : 0;

  const paymentMethod: string = req.body.paymentMethod!;
  const subscriptionId: number = req.body.subscriptionId!;

  let language: string = req.headers['accept-language'] ? req.headers['accept-language'] : 'en';

  console.log(email, password, firstName, lastName, street, zipCode, countryId, age, paymentMethod, subscriptionId, language)


  //TODO: Payment method validation for specific types only visa, mastercard, paypal, etc.
  if (language.includes(",")) {
    const preferredLanguage: string[] = language.split(',')
    language = preferredLanguage[0].trim();
  }

  if (validateStrings([firstName, lastName, paymentMethod, street, zipCode, language]) === false) {
    responder(res, 400, 'error', 'Invalid input values');
    return;
  }

  if (paymentMethod !== 'Visa' && paymentMethod !== 'Mastercard' && paymentMethod !== 'Paypal' && paymentMethod !== 'Apple Pay' && paymentMethod !== 'Google Pay' && paymentMethod !== 'iDEAL') {
    responder(res, 400, 'error', 'Invalid payment method');
    return;
  }

  if (validateNumbers([subscriptionId, countryId]) === false) {
    responder(res, 400, 'error', 'Invalid input values');
    return;
  }

  if (subscriptionId > 3) {
    responder(res, 400, 'error', 'Invalid subscription id');
    return;
  }

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
    console.log(1);
    responder(res, 500, 'error', 'Internal Server Error')
    return;
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.tx(async (t) => {
      // Create account
      await t.none(`INSERT INTO Account (email, password, first_name, last_name, active_subscription, blocked, verified, street, zip_code, country_id, log_in_attempt_count, invited, user_type) 
        VALUES ($<email>, $<password>, $<first_name>, $<last_name>, 
        $<active_subscription>, $<blocked>, $<verified>, $<street>, $<zip_code>,
        $<country_id>, $<log_in_attempt_count>, $<invited>, $<user_type>)`, {
        email: email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        active_subscription: false,
        blocked: false,
        verified: false,
        street: street,
        zip_code: zipCode,
        country_id: countryId,
        log_in_attempt_count: 0,
        invited: false,
        user_type: 'User'
      });

      // grab account id
      const account_id = await t.one(`SELECT account_id FROM Account WHERE email = $<email>`, {
        email: email
      });

      // grab subscription price
      const subscriptionPrice = await t.one(`SELECT subscription_price FROM Subscription WHERE subscription_id = $<subscriptionId>`, {
        subscriptionId: subscriptionId
      });

      // Create account subscription
      await t.none(`INSERT INTO Account_subscription (account_id, subscription_id, payment_method, price) 
      VALUES ($<account_id>, $<subscription_id>, $<payment_method>, $<price>)`, {
        account_id: account_id['account_id'],
        subscription_id: subscriptionId,
        payment_method: paymentMethod,
        price: subscriptionPrice.subscription_price
      });

      // Create profile
      await t.none(`INSERT INTO Profile (account_id, age, profile_image, profile_name, language)
      VALUES ($<account_id>, $<age>, $<profile_image>, $<profile_name>, $<language>)`, {
        account_id: account_id['account_id'],
        age: age,
        profile_image: 'default',
        profile_name: (`${firstName}-${lastName}`).toLowerCase(),
        language: language
      });
    });
  } catch (err) {
    responder(res, 500, 'error', 'Internal Server Error');
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
    responder(res, 500, 'error', 'Error sending email');
    return;
  }
};

// Account verification logic
export const getVerifyUser = async (req: Request, res: Response): Promise<void> => {

  //get token from url
  const token: string = req.params.token!;

  if (token === undefined) {
    responder(res, 400, 'error', 'Invalid Request');
    return;
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
      const invitedObject = await db.oneOrNone('SELECT * FROM invite WHERE invited_email = ${invitedEmail}', {
        invitedEmail: email
      });
      if (invitedObject) {
        //If there is an invited object, execute the following logic db queries in a transaction:
        //Update inviting user to have invited = true
        //Delete invite object from db
        //Update invited user to have invited = true and verified = true
        try {
          await db.tx(async (t) => {
            // grab inviting user's account id
            const invitingEmailObject: any = await t.one('SELECT * FROM Account WHERE email = $<email>', {
              email: invitedObject.inviting_email
            });

            // grab invited user's account id
            const invitedEmailObject: any = await t.one('SELECT * FROM Account WHERE email = $<email>', {
              email: invitedObject.invited_email
            });

            // 1. Update inviting user to have invited = true
            await t.none('UPDATE Account SET invited = $<invited> WHERE email = $<email>', {
              invited: true,
              email: invitedObject.inviting_email
            });

            // 2. Update invited user to have invited = true and verified = true
            await t.none('UPDATE Account SET invited = $<invited>, verified = $<verified> WHERE email = $<email>', {
              invited: true,
              verified: true,
              email: invitedObject.invited_email
            });

            // 3. Update inviting user's subscription to have price - 2 (also check if inviting user is invited to prevent infinite money glitch)
            if (invitingEmailObject['invited'] === false) {
              await t.none(`UPDATE account_subscription SET price = price - $<decrementAmount> WHERE account_id = $<account_id>`, {
                decrementAmount: 2.0,
                account_id: invitingEmailObject['account_id']
              });
            }

            // 4. Update invited user's subscription to have price - 2 (Invite can not be sent to an account already in the db therefore no need to check if invited user is invited)
            await t.none(`UPDATE account_subscription SET price = price - $<decrementAmount> WHERE account_id = $<account_id>`, {
              decrementAmount: 2.0,
              account_id: invitedEmailObject['account_id']
            });

            // 5. Delete invite object from db
            await t.none('DELETE FROM Invite WHERE invited_email = $<email>', {
              email: invitedObject.invited_email
            });
          });

          responder(res, 200, 'message', 'Account verified successfully');
          return;
        } catch (err) {
          responder(res, 500, 'error', 'Internal Server Error');
          return;
        }
      }

      //If there is no invited object, execute the following just update the verified column in the Account table to true
      try {
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
    } catch (err) {
      console.log(err);
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

// 