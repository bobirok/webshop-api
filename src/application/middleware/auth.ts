import { JwtFactory } from '../../infrastructure/jwtFactory';
require('dotenv').config();

export class Authentication {

    public static async authenticate(request: any, response: any, next: any) {
        try {
            let token: string = request.header('Authorization').replace('Bearer ', '')
            const decode: any = JwtFactory.verifyToken(token);
            
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

    public static async authenticateAdministrator(request: any, response: any, next: any) {
        try {
            if(!request.header('Authorization')) {
                 throw new Error('Please authenticate!')
            }

            let token: string = request.header('Authorization').replace('Bearer ', '');
            const decode: any = JwtFactory.verifyToken(token);

            if(!decode.isAdmin) {
                throw new Error('You do not have permissions!');
            }

            request.username = decode.username;
            
            next();
        }
        catch(e) {
            return response.status(401).send(e.message);
        }
    }
}