import * as firebase from 'firebase';
import { User } from '../domain/user';
import { JwtFactory } from './jwtFactory';

const bcrypt = require('bcrypt');

require('dotenv').config();

export class UserClient {

  private database = require('./database');

  public async registerUser(user: User, password: string): Promise<string> {
    let snapShot = await this.database.collection('user').where('username', '==', user.username).get()

    let token = await this.processRegistration(snapShot, user, password)

    return token
  }

  public async loginUser(username: string, password: string): Promise<string> {
    let userSnapshot = await this.getUser(username);

    let token = await this.processLogin(userSnapshot, password);

    return token;
  }

  public async logOut(username: string): Promise<void> {
    let userDocument: firebase.firestore.QuerySnapshot = await this.getUser(username);

    await this.removeTokenFromUser(userDocument);
  }

  public getUser(username: string): Promise<firebase.firestore.QuerySnapshot> {
    return new Promise((resolve, reject) => {
      this.database.collection('user').where('username', '==', username).get()
        .then((snapShot: firebase.firestore.QuerySnapshot) => {
          resolve(snapShot)
        })
    })
  }

  private async processLogin(snapShot: firebase.firestore.QuerySnapshot, password: string): Promise<string> {
    if (snapShot.size === 0) {
      throw new Error('No registration with these credentials!')
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, snapShot.docs[0].data().password, async (err: Error, res: boolean) => {
        if (!res) { reject('The credentials are invalid!') }
        let token = await this.insertToken(snapShot.docs[0]);
        resolve(token);
      })
    })
  }

  private saltPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 8, function (err: any, hash: string) {
        resolve(hash);
      });
    })
  }

  private async processRegistration(snapShot: firebase.firestore.QuerySnapshot, user: User, password: string): Promise<string> {
    if (snapShot.size !== 0) {
      throw new Error('Account with this username exists!');
    }

    let salted_password = await this.saltPassword(password);
    await this.database.collection('user').add({ ...user, password: salted_password, cart: [...user.cart.products] });
    let user_snapshot = await this.getUser(user.username);
    let token = await this.assignTokenToUser(user_snapshot);

    return token;
  }

  private async assignTokenToUser(snapShot: firebase.firestore.QuerySnapshot): Promise<string> {
    return await this.insertToken((<firebase.firestore.QueryDocumentSnapshot>snapShot.docs[0]))
  }

  private async insertToken(doc: firebase.firestore.QueryDocumentSnapshot): Promise<string> {
    const token = JwtFactory.generateToken(doc.data());
    await doc.ref.update({ token });

    return token;
  }

  private async removeTokenFromUser(snapShot: firebase.firestore.QuerySnapshot): Promise<void> {
    await snapShot.docs[0].ref.update({ token: '' });
  }
}