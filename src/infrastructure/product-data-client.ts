import * as firebase from 'firebase';
import  firestore from 'firebase/firestore'
import { Product } from '../domain/product';
require('dotenv').config()

export class ProductDataClient {
    
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

    public createProduct(product: Product): void {
      try {
          this.database.collection('product').add({ ...product })
      }
      catch (e) {
          Promise.reject(e);
      }
  }

  public async getProducts(): Promise<any> {
      let arr: any[] = [];
      return await this.database.collection('product').get()
          .then((snapshot) => {
              snapshot.forEach((doc) => {
                  arr.push(doc .data())
              })
              return arr;
          })
  }

  public deleteProduct(product: Product): void {
      try {
          let foundProduct = this.getSpecificProduct(product.name);

          this.removeFromStorage(foundProduct)
      }
      catch (e) {
          throw new Error(e.message);
      }
  }

  public updateProduct(product: Product, data: any): void {
      try {
          this.database.collection('product').where('slug', '==', product.slug)
          .get()
          .then((snapShot) => {
              snapShot.forEach((doc) => {
                  this.database.collection('product').doc(doc.id).set({
                      name: data.name,
                      slug: product.slug,
                      createdBy: product.createdBy,
                      dateAdded: product.dateAdded,
                      quantity: product.quantity
                  })
              })                
          })
      }
      catch(e) {
          throw new Error(e.message)
      }
  }

  private getSpecificProduct(productName: string): any {
      try {
          return this.database.collection('product').where('name', '==', productName)
      }
      catch (e) {
          return Promise.reject(e)
      }
  }

  private removeFromStorage(foundProduct: any): void {
      try {
          foundProduct.get().then((querySnapshot: any) => {
              querySnapshot.forEach((doc: any) => {
                  doc.ref.delete();
              });
          });
      }
      catch (e) {
          throw new Error(e.message)
      }
  }
}