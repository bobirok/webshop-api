import { ProductDataClient } from "../../infrastructure/product-data-client";
import { Product } from "../product";

export class ProductsRepository {
    private databaseClient = new ProductDataClient()

    public async getProducts(): Promise<Product[]> {
        try {
            return await this.databaseClient.getProducts();
        } 
        catch(e) {
            return Promise.reject(e)
        }
    }

    public async getProduct(id: string): Promise<Product> {
        try {
            return await this.databaseClient.getProduct(id);
        }
        catch(e) {
            return Promise.reject(e);
        }
    }
}