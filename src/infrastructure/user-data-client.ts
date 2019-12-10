import * as firebase from 'firebase';
import { User } from '../domain/user';
import * as jwt from 'jsonwebtoken';
import { Product } from '../domain/product';

const bcrypt = require('bcrypt');

require('dotenv').config();

export class UserDataClient {

  private database = require('./database');

  public async registerUser(user: User, password: string): Promise<string> {
    try {
      let snapShot = await this.database.collection('user').where('username', '==', user.username).get()

      let token = await this.processRegistration(snapShot, user, password)

      return token
    }
    catch (e) {
      return Promise.reject(e)
    }
  }

  public async loginUser(username: string, password: string): Promise<string> {
    try {
      let userSnapshot = await this.getUser(username);

      let token = await this.processLogin(userSnapshot, password);

      return token;
    }
    catch (e) {
      return Promise.reject(e)
    }
  }

  public async logOut(username: string): Promise<void> {
    try {
      let userDocument: firebase.firestore.QuerySnapshot = await this.getUser(username);

      this.removeTokenFromUser(userDocument);

      Promise.resolve();
    }
    catch (e) {
      Promise.reject(e);
    }
  }

  public getUser(username: string): Promise<firebase.firestore.QuerySnapshot> {
    try {
      return new Promise((resolve, reject) => {
        this.database.collection('user').where('username', '==', username).get()
          .then((snapShot: firebase.firestore.QuerySnapshot) => {
            resolve(snapShot)
          })
      })
    }
    catch (e) {
      return Promise.reject(e)
    }
  }

  private async getUserByToken(token: string): Promise<firebase.firestore.DocumentSnapshot> {
    try {
      let snapShot: firebase.firestore.QuerySnapshot = await this.database.collection('user').where('token', '==', token).get();

      return snapShot.docs[0];
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

  private async processLogin(snapShot: firebase.firestore.QuerySnapshot, password: string): Promise<string> {
    try {

      if (snapShot.size === 0) {
        throw new Error('No registration with these credentials!')
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, snapShot.docs[0].data().password, async (err: Error, res: boolean) => {
          if (!res) { reject('The credentials are invalid!') }
          let token = await this.insertToken(res, snapShot.docs[0]);
          resolve(token);
        })
      })

    }
    catch (e) {
      return Promise.reject(e)
    }
  }

  private saltPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 8, function (err: any, hash: string) {
        resolve(hash);
      });
    })
  }

  private async processRegistration(snapShot: firebase.firestore.QuerySnapshot, user: User, password: string): Promise<string> {
    try {
      
      if(snapShot.size !== 0) {
        throw new Error('Account with this username exists!');
      }

      let salted_password = await this.saltPassword(password);
      await this.database.collection('user').add({ ...user, password: salted_password, cart: [...user.cart.products] });
      let user_snapshot = await this.getUser(user.username);
      let token = await this.assignTokenToUser(user_snapshot);

      return token;

    }
    catch(e) {
      console.log(e)
      return Promise.reject(e);
    }
  }

  private async assignTokenToUser(snapShot: firebase.firestore.QuerySnapshot): Promise<string> {
    try {
      return await this.insertToken(true, (<firebase.firestore.QueryDocumentSnapshot>snapShot.docs[0]))
    }
    catch (e) {
      return Promise.reject(e)
    }
  }

  private async insertToken(accountExists: boolean, doc: firebase.firestore.QueryDocumentSnapshot): Promise<string> {
    try {

      if (!accountExists) {
        throw new Error('No registration with these credentials');
      }

      const token = this.generateJwtToken(doc.data());
      await doc.ref.update({ token });

      return token;

    }
    catch (e) {
      return Promise.reject(e);
    }
  }

  private async removeTokenFromUser(snapShot: firebase.firestore.QuerySnapshot): Promise<void> {
    try {
      await snapShot.docs[0].ref.update({ token: '' });
    }
    catch (e) {
      Promise.reject(e);
    }
  }

  private generateJwtToken(user: firebase.firestore.DocumentData): string {
    return jwt.sign({ username: user.username, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY!);
  }
}