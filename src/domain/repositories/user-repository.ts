import { UserClient } from "../../infrastructure/user-client";
import { User } from "../user";
import { firestore } from "firebase";
import { Cart } from "../cart";

export class UserRepository {
    private userClient = new UserClient();

    public async registerUser(user: User, password: string): Promise<string> {
        return await this.userClient.registerUser(user, password);
    }

    public async loginUser(username: string, password: string): Promise<string> {
        return await this.userClient.loginUser(username, password);
    }

    public async logOutUser(token: string): Promise<void> {
        await this.userClient.logOut(token);
    }

    public async getUser(username: string): Promise<User> {
        let userSnapshot = await this.userClient.getUser(username);

        return this.buildUserProfile(userSnapshot);
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