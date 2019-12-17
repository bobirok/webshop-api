import * as firebase from 'firebase';
import { Product } from '../domain/product';
require('dotenv').config()

export class ProductDataClient {
    private database = require('./database');

    public async createProduct(product: any): Promise<void> {
        await this.database.collection('product').add({ ...product })
    }

    public async getProducts(): Promise<any[]> {
        let arr: any[] = [];

        return await this.database.collection('product').get()
            .then((snapshot: firebase.firestore.QuerySnapshot) => {
                snapshot.forEach((doc) => {
                    arr.push(doc.data())
                })

                return arr;
            })
    }

    public async getProduct(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.collection('product').where('id', '==', id)
                .get()
                .then((snapShot: firebase.firestore.QuerySnapshot) => {
                    let product = snapShot.docs[0].data();

                    if (!product) {
                        reject('Product does not exist!')
                    }

                    resolve(product)
                })
        })
    }

    public async deleteProduct(productId: string): Promise<void> {
        let foundProduct = await this.getProductForDeletion(productId);

        await this.removeFromStorage(foundProduct)
    }

    public updateProduct(product: Product, data: any): void {
        this.database.collection('product').where('slug', '==', product.slug)
            .get()
            .then((snapShot: firebase.firestore.QuerySnapshot) => {
                snapShot.forEach((doc) => {
                    this.database.collection('product').doc(doc.id).set({
                        name: data.name,
                        slug: product.slug,
                        dateAdded: product.dateAdded,
                        quantity: product.quantity
                })
            })
        })
    }

    private getProductForDeletion(productId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.collection('product').where('id', '==', productId)
                .get()
                .then((snapShot: firebase.firestore.QuerySnapshot) => {

                    if (!snapShot.docs.length) {
                        reject(new Error('Product does not exist!'))
                    }

                    resolve(snapShot.docs[0])
                })
        })

    }

    private async removeFromStorage(foundProduct: firebase.firestore.QueryDocumentSnapshot): Promise<void> {
        await foundProduct.ref.delete();
    }
}