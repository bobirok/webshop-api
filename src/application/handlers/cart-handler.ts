import { CartRepository } from "../../domain/repositories/cart-repository";
import { Cart } from "../../domain/cart";

export class CartHandler {
    private cartRepository = new CartRepository()
    
    public async getCartProducts(req: any, res: any): Promise<any> {
        let username = req.username;
        
        try {
            let cart: Cart = await this.cartRepository.getCartProducts(username)

            return res.status(200).send(cart);
        }
        catch(e) {
            return res.send(e);
        }
    }

    public async addProductToUserCart(req: any, res: any): Promise<any> {
        let username = req.username;
        let productId = req.params.productid;

        try {
            await this.cartRepository.addToUserCart(username, productId);

            return res.status(200).send('Added to cart!')
        }
        catch(e) {
            return res.status(400).send('Product can not be added!');
        }
    }
}