import * as firebase from 'firebase';
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
}