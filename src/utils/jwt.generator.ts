/*
TODO: CREATE A FUNCTION THAT CAN TAKE IN ANY NUMBER OF ARGUMENTS AND ENCODE THEM IN THE JWT TOKEN. 
TODO: ALSO SOMEHOW IT HAS TO BE ABLE TO SET CUSTOM TIME LIMIT FOR IT AS WELL

*/
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

function jwtTokenGenerator(time : string , ...args : string[]): string {

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }

    const token: string = jwt.sign({data: args}, process.env.JWT_SECRET, { expiresIn: time });
    return token;

}

export default jwtTokenGenerator;