import { Request, Response } from 'express';

export const postRegisterUser = async (req: Request, res: Response): Promise<void> => {

    const email : string = req.body.email;
    const password : string = req.body.password;

    if (!isValidEmail(email)) {
        res.status(422).json({
          error: "Invalid email address. Please make sure that the input values are valid."
        });
        return;
      }
    
      if (!isValidPassword(password)) {
        res.status(422).json({
          error: "Invalid password. Please make sure that the input values are valid."
        });
        return;
      }

      //Logic to send email and verify account

  res.status(200).json({
    message: `Register is working and email is ${email} and password is ${password}`,
  });
};


function isValidEmail(email: string): Boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  //! DONT FORGET TO REMOVE THE PASSOWORD OPTION WHICH IS FOR TESTING
function isValidPassword(password: string): Boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if(password == "password"){
        return true;
    }
    return passwordRegex.test(password);
}