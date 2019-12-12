import * as uuid from 'uuid';
import { ProductsRepository } from "../../domain/repositories/products-repository";
import { Product } from "../../domain/product";

export class ProductHandler {
    private productRepository = new ProductsRepository();

    public async createProduct(req: any, res: any): Promise<any> {
        let id = uuid.v4();
        let name = req.query.name;
        let price = req.query.price;
        let image = req.query.image;
        let quantity = req.query.quantity;
        let date = Date.now();

        try {
            let product = new Product(id, name, price, image, quantity, date);

            await this.productRepository.createProduct(product);

            return res.status(200).send('Added successfully!')
        }
        catch(e) {
            return res.status(400).send('Something went wrong!')
        }
    }

    public async getAllProducts(req: any, res: any): Promise<any> {
        try {
            let products: Product[] = await this.productRepository.getProducts();
            
            return res.status(200).send(products);
        }
        catch(e) {
            return res.status(400).send(e.message);
        }
    }

    public async getProduct(req: any, res: any): Promise<any> {
        const id = req.params.id;
        
        try {
            const product = await this.productRepository.getProduct(id);

            return res.status(200).send(product);
        }
        catch(e) {
            return res.status(404).send('Not found!');
        }
    }

    public async deleteProduct(req: any, res: any) {
        let id = req.params.id;

        try {
            await this.productRepository.deleteProduct(id);
            
            return res.status(200).send('Done!')
        }
        catch(e) {
            return res.status(400).send('You are not allowed to delete!')
        }
    }
}