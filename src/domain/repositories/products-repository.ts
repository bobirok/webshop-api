import { ProductDataClient } from "../../infrastructure/product-data-client";
import { Product } from "../product";

export class ProductsRepository {
    private productDataClient = new ProductDataClient()

    public async getProducts(): Promise<Product[]> {
        try {
            return await this.productDataClient.getProducts();
        } 
        catch(e) {
            return Promise.reject(e)
        }
    }

    public async getProduct(id: string): Promise<Product> {
        try {
            return await this.productDataClient.getProduct(id);
        }
        catch(e) {
            return Promise.reject(e);
        }
    }

    public async deleteProduct(id: string): Promise<void> {
        try {
            await this.productDataClient.deleteProduct(id);
        }
        catch(e) {
            Promise.reject(e);
        }
    }
}