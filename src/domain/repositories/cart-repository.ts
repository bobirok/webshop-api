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
        let userSnapshot = await this.userClient.getUser(username);
        let products: Product[] = userSnapshot.docs[0].data().cart;

        let cart = new Cart(products);

        return cart;
    }

    public async addToUserCart(username: string, productId: string): Promise<void> {
        let product: Product = await this.productClient.getProduct(productId);

        await this.cartClient.addProductToCart(username, product);
    }

    public async removeProductFromCart(username: string, productId: string): Promise<void> {
        await this.cartClient.removeProductFromCart(username, productId);
    }
}