import * as express from 'express';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();

export class Authentication {

    public static async authenticate(request: any, response: any, next: any) {
        try {
            let token: string = request.header('Authorization')!.replace('Bearer ', '')
            const decode: any = jwt.verify(token, process.env.JWT_SECRET_KEY!)

            if(!decode.username) {
                throw new Error();
            }

            request.username = decode.username;

            next();
        }
        catch(e) {
            return response.status(401).send('Please authenticate!')
        }
    }
}