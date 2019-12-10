import * as firebase from 'firebase';
import firestore from 'firebase/firestore'
import { UserDataClient } from './user-data-client';

require('dotenv').config()

export class CartClient {
    private userClient = new UserDataClient();
    private database = require('./database')

    public async addProductToCart(username: string, product: any): Promise<void> {
        let cart: any[] = await this.getCart(username);

        cart.push(product);

        await this.setCart(username, cart);
    }

    public async removeProductFromCart(username: string, productid: string): Promise<void> {
        let cart: any[] = await this.getCart(username);

        cart = cart.filter(_ => _.id !== productid);

        await this.setCart(username, cart)
    }

    private async getCart(username: string): Promise<any> {
        let userSnapshot = await this.userClient.getUser(username);

        return userSnapshot.docs[0].data().cart;
    }

    private async setCart(username: string, cart: any): Promise<void> {
        let userSnapshot = await this.userClient.getUser(username);
        let docId = userSnapshot.docs[0].id;

        await this.database.collection('user').doc(docId).set({ cart }, { merge: true })
    }
}