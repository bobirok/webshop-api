import { CartRepository } from "../../domain/repositories/cart-repository";
import { Cart } from "../../domain/cart";

export class CartHandler {
    private cartRepository = new CartRepository()
    
    public async getCartProductsHandler(req: any, res: any): Promise<any> {
        let username = req.username;
        
        try {
            let cart: Cart = await this.cartRepository.getCartProducts(username)
            return res.status(200).send({
                products: cart.products,
                total: cart.total
            });
        }
        catch(e) {
            return res.send(e);
        }
    }

    public async addProductToUserCartHandler(req: any, res: any): Promise<any> {
        let username = req.username;
        let productId = req.params.productid;

        try {
            await this.cartRepository.addToUserCart(username, productId);

            return res.status(200).send('Added to cart!')
        }
        catch(e) {
            return res.status(400).send(e.message);
        }
    }

    public async removeProductFromCartHandler(req: any, res: any): Promise<any> {
        let username: string = req.username;
        let productid: string = req.params.productid;

        try {
            await this.cartRepository.removeProductFromCart(username, productid);
            
            return res.status(200).send('Item has been removed!');
        }
        catch(e) {
            return res.status(400).send(e)
        }
    }
}