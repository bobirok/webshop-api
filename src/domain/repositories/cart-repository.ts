import { UserDataClient } from "../../infrastructure/user-data-client";
import { Cart } from "../cart";
import { Product } from "../product";
import { CartClient } from "../../infrastructure/cart-client";
import { ProductDataClient } from "../../infrastructure/product-data-client";

export class CartRepository {
    private userClient = new UserDataClient();
    private cartClient = new CartClient();
    private productClient = new ProductDataClient()

    public async getCartProducts(username: string): Promise<Cart> {
        try {
            let userSnapshot = await this.userClient.getUser(username);
            let cart = userSnapshot.docs[0].data().cart;

            return cart;
        }
        catch(e) {
            return Promise.reject(e);
        }
    }

    public async addToUserCart(username: string, productId: string): Promise<void> {
        try {
            let product: Product = await this.productClient.getProduct(productId);

            await this.cartClient.addProductToCart(username, product);
        }
        catch(e) {
            Promise.reject(e);
        }
    }
}