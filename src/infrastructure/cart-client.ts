import * as firebase from 'firebase';
import firestore from 'firebase/firestore'
import { UserDataClient } from './user-data-client';
require('dotenv').config()

export class CartClient {
    private userClient = new UserDataClient();
    private database = require('./database')

    public async addProductToCart(username: string, product: any): Promise<void> {
        try {
            let userSnapshot = await this.userClient.getUser(username);
            let cart = userSnapshot.docs[0].data().cart;
            cart.push({ ...product })
            let docId = userSnapshot.docs[0].id;

            await this.database.collection('user').doc(docId).set({ cart }, { merge: true })
        }
        catch (e) {
            Promise.reject(e);
        }
    }
}