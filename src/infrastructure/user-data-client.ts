import * as firebase from 'firebase';
import { User } from '../domain/user';
import * as jwt from 'jsonwebtoken'

const bcrypt = require('bcrypt')

require('dotenv').config()

export class UserDataClient {

  private firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
  };

  private app = firebase.initializeApp(this.firebaseConfig)

  public database = this.app.firestore()

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

  public loginUser(username: string, password: string): Promise<void> {
    try {
      return new Promise((resolve, reject) => {
        this.getUser(username).then(snapShot => {
          this.processLogin(snapShot, password)
          resolve(snapShot.docs[0].data().token)
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
          .then(snapShot => {
            resolve(snapShot)
          })
      })
    }
    catch (e) {
      return Promise.reject(e)
    }
  }

  private processLogin(snapShot: firebase.firestore.QuerySnapshot, password: string): void {
    if (snapShot.size === 0) {
      Promise.reject(new Error('No registration with these credentials!'))
    } else {
      snapShot.forEach(doc => {
        bcrypt.compare(password, doc.data().password, (err: Error, res: boolean) => {
          this.insertToken(res, doc)
        })
      })
    }
  }

  private saltPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 8, function (err: any, hash: string) {
        resolve(hash)
      });
    })
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
      return new Promise((resolve, reject) => {
        let token: string = '';
        snapShot.forEach(async (doc) => {
          token = await this.insertToken(true, doc);
        })
        resolve(token)
      })
    }
    catch (e) {
      return Promise.reject(e)
    }
  }
}