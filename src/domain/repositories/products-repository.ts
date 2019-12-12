import { ProductDataClient } from "../../infrastructure/product-data-client";
import { Product } from "../product";

export class ProductsRepository {
    private productDataClient = new ProductDataClient()

    public async createProduct(product: Product): Promise<void> {
        await this.productDataClient.createProduct(product);
    }

    public async getProducts(): Promise<Product[]> {
        return await this.productDataClient.getProducts();
    }

    public async getProduct(id: string): Promise<Product> {
        return await this.productDataClient.getProduct(id);
    }

    public async deleteProduct(id: string): Promise<void> {
        await this.productDataClient.deleteProduct(id);
    }
}