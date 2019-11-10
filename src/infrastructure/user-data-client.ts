import * as firebase from 'firebase';
import { User } from '../domain/user';
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

  public registerUser(user: User): void {
    try {
      this.database.collection('user').where('username', '==', user.username).get()
      .then((snapShot) => {
          if (snapShot.size === 0) {
            console.log('here')
            this.database.collection('user').add({ ...user })
          } else {
            throw new Error('This username is already in use!')
          }
      })
    }
    catch (e) {
      throw new Error(e)
    }
  }
}

let user = new User('boris', 'rokanov', 'bobirok', 20, 201911102130, [])
let ud = new UserDataClient()
ud.registerUser(user)