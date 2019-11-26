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

  public loginUser(username: string, password: string): Promise<string> {
    try {
      return new Promise(async (resolve, reject) => {
        let userSnapshot = await this.getUser(username);
        this.processLogin(userSnapshot, password)
        .then((token) => {
          console.log('kurec' + token)
          resolve(token)
        })
        .catch((e) => {
          reject(e)
        })
      })
    }
    catch (e) {
      return Promise.reject(e)
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

  private async processLogin(snapShot: firebase.firestore.QuerySnapshot, password: string): Promise<string> {
    try {
      if (snapShot.size === 0) {
        return Promise.reject(new Error('No registration with these credentials!'))
      } else {
        return new Promise((resolve, reject) => {
          bcrypt.compare(password, snapShot.docs[0].data().password, async (err: Error, res: boolean) => {
            if (!res) { return Promise.reject('The credentials are invalid!') }
            let token = await this.insertToken(res, snapShot.docs[0]);
            resolve(token)
          })
        })
      }
    }
    catch (e) {
      return Promise.reject()
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
}