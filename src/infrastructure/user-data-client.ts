import * as firebase from 'firebase';
import { User } from '../domain/user';
import * as jwt from 'jsonwebtoken';

const bcrypt = require('bcrypt');

require('dotenv').config();

export class UserDataClient {

  private database = require('./database');

  public async registerUser(user: User, password: string): Promise<string> {
    try {
      let snapShot = await this.database.collection('user').where('username', '==', user.username).get()

      let token = await this.processRegistration(snapShot, user, password)

      return Promise.resolve(token)
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

  public async logOut(token: string): Promise<void> {
    try {
      let userDocument: firebase.firestore.DocumentSnapshot = await this.getUserByToken(token);

      this.removeTokenFromUser(userDocument);

      Promise.resolve();
    }
    catch(e) {
      Promise.reject(e);
    }
  }

  private getUser(username: string): Promise<any> {
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
    catch(e) {
      return Promise.reject(e);
    }
  }

  private async processLogin(snapShot: firebase.firestore.QuerySnapshot, password: string): Promise<string> {
    try {
      if (snapShot.size === 0) {
        throw new Error('No registration with these credentials!')
      } else {
        return new Promise((resolve, reject) => {
          bcrypt.compare(password, snapShot.docs[0].data().password, async (err: Error, res: boolean) => {
            if (!res) { reject('The credentials are invalid!') }
            let token = await this.insertToken(res, snapShot.docs[0]);
            resolve(token)
          })
        })
      }
    }
    catch (e) {
      return Promise.reject(e)
    }
  }

  private saltPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 8, function (err: any, hash: string) {
        resolve(hash)
      });
    })
  }

  private generateJwtToken(id: string): string {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY!)
  }

  private async processRegistration(snapShot: firebase.firestore.QuerySnapshot, user: User, password: string): Promise<string> {
    if (snapShot.size === 0) {

      let salted_password = await this.saltPassword(password);
      await this.database.collection('user').add({ ...user, password: salted_password })
      let user_snapshot = await this.getUser(user.username)
      let token = await this.assignTokenToUser(user_snapshot)

      return Promise.resolve(token)
    }
    else {
      return Promise.reject()
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

  private insertToken(accountExists: boolean, doc: firebase.firestore.QueryDocumentSnapshot): Promise<string> {
    if (accountExists) {

      const token = this.generateJwtToken(doc.data().id)
      doc.ref.update({ token })

      return Promise.resolve(token)
    }
    else {
      return Promise.reject(new Error('No registration with these credentials'))
    }
  }

  private async removeTokenFromUser(doc: firebase.firestore.DocumentSnapshot): Promise<void> {
    try {
      await doc.ref.update({token: ''})
    }
    catch(e) {
      Promise.reject(e)
    }
  }
}