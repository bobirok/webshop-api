import { UserClient } from "../../infrastructure/user-client";
import { Cart } from "../cart";
import { Product } from "../product";
import { CartClient } from "../../infrastructure/cart-client";
import { ProductClient } from "../../infrastructure/product-client";

export class CartRepository {
    private userClient = new UserClient();
    private cartClient = new CartClient();
    private productClient = new ProductClient()

    public async getCartProducts(username: string): Promise<Cart> {
        let userSnapshot = await this.userClient.getUser(username);
        let products: Product[] = userSnapshot.docs[0].data().cart;

        let cart = new Cart(products);

        return cart;
    }

    public async addToUserCart(username: string, productId: string): Promise<void> {
        if(await this.isInUserCart(username, productId)) {
            throw new Error('This item is already in cart!')
        }

        let product: Product = await this.productClient.getProduct(productId);
        
        await this.cartClient.addProductToCart(username, product);

        await this.productClient.reduceProductQuantity(productId);
    }

    public async removeProductFromCart(username: string, productId: string): Promise<void> {
        await this.cartClient.removeProductFromCart(username, productId);

        await this.productClient.increaseProductQuantity(productId);
    }

    private async isInUserCart(username: string, productId: string): Promise<boolean> {
        let cart = await this.getCartProducts(username);

        return cart.products.some(_ => _.id === productId);
    }

}