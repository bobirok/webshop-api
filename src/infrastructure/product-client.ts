import * as firebase from 'firebase';
require('dotenv').config()

export class ProductClient {
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

    public async updateProduct(product: any): Promise<void> {
        this.database.collection('product').where('id', '==', product.id)
            .get()
            .then((snapShot: firebase.firestore.QuerySnapshot) => {
                snapShot.forEach((doc) => {
                    this.database.collection('product').doc(doc.id).set({
                        name: product.name,
                        id: product.id,
                        dateAdded: product.dateAdded,
                        quantity: product.quantity,
                        price: product.price,
                        image: product.image
                })
            })
        })
    }

    public async reduceProductQuantity(productId: string): Promise<void> {
        let product = await this.getProduct(productId);
        product.quantity--;
        await this.updateProduct(product);
    }

    public async increaseProductQuantity(productId: string): Promise<void> {
        let product = await this.getProduct(productId);
        product.quantity++;
        await this.updateProduct(product);
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

let productClient = new ProductClient();
productClient.reduceProductQuantity('aweqw21-aa').then(console.log)