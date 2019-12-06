import { UserDataClient } from "../../infrastructure/user-data-client";
import { User } from "../user";
import { firestore } from "firebase";
import { Product } from "../product";
import { ProductDataClient } from "../../infrastructure/product-data-client";
import { Cart } from "../cart";

export class UserRepository {
    private userClient = new UserDataClient();
    private productClient = new ProductDataClient();

    public async registerUser(user: User, password: string): Promise<string> {
        try {
            return await this.userClient.registerUser(user, password);
        }
        catch(e) {
            return Promise.reject(e)
        }
    }

    public async loginUser(username: string, password: string): Promise<string> {
        try {
            return await this.userClient.loginUser(username, password);
        }
        catch(e) {
            return Promise.reject(e);
        }
    }

    public async logOutUser(token: string): Promise<void> {
        try {
            await this.userClient.logOut(token);
        }
        catch(e) {
            Promise.reject(e)
        }
    }

    public async addToUserCart(username: string, productId: string): Promise<void> {
        try {
            let product: Product = await this.productClient.getProduct(productId);

            await this.userClient.addProductToCart(username, product);
        }
        catch(e) {
            Promise.reject(e);
        }
    }

    public async getUser(username: string): Promise<User> {
        try {
            let userSnapshot = await this.userClient.getUser(username);
            return this.buildUserProfile(userSnapshot);
        }
        catch(e) {
            return Promise.reject(e);
        }
    }

    private buildUserProfile(snapshot: firestore.QuerySnapshot): User {
        let data = snapshot.docs[0].data();
        let username: string = data.username;
        let firstName: string = data.firstName;
        let lastName: string = data.lastName;
        let age: number = data.age;
        let dateCreated: number = data.profileCreatedAt;
        let isAdmin: boolean = data.isAdmin;
        let cart: Cart = data.cart;

        return new User(firstName, lastName, username, age, dateCreated, isAdmin, cart)
    }
}