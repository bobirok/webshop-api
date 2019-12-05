import { ProductsRepository } from "../../domain/repositories/products-repository";

export class ProductHandler {
    private productRepository = new ProductsRepository();

    public async getAllProducts(req: any, res: any): Promise<any> {
        try {
            let products = await this.productRepository.getProducts();
            return res.status(200).send(products);
        }
        catch(e) {
            return res.status(400).send();
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
}