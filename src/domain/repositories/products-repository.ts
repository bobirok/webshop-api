import { ProductDataClient } from "../../infrastructure/product-data-client";
import { Product } from "../product";
import { User } from "../user";

export class ProductsRepository {
    private databaseClient = new ProductDataClient()

    public createProduct(product: Product): void {
        try {
            this.databaseClient.database.collection('product').add({ ...product })
        }
        catch (e) {
            Promise.reject(e);
        }
    }

    public async getProducts(): Promise<any> {
        let arr: any[] = [];
        return await this.databaseClient.database.collection('product').get()
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

    private getSpecificProduct(productName: string): any {
        try {
            return this.databaseClient.database.collection('product').where('name', '==', productName)
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

let productRepo = new ProductsRepository()
productRepo.getProducts().then(console.log)
// let user = new User('bobi', 'rokanov', 'bobirok', 20, Date.now(), [])
// let product = new Product('test', 12, Date.now(), {...user})
//productRepo.createProduct({...product})