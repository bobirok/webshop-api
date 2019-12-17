import * as firebase from 'firebase'
import * as jwt from 'jsonwebtoken'

require('dotenv').config();

export class JwtFactory {

    public static generateToken(user: firebase.firestore.DocumentData): string {
        return jwt.sign({ username: user.username, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY!);
    }

    public static verifyToken(token: string): any {
        return jwt.verify(token, process.env.JWT_SECRET_KEY!)
    }
}