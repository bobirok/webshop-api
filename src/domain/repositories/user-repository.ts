import { UserClient } from "../../infrastructure/user-client";
import { User } from "../user";
import { firestore } from "firebase";

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

    public async deleteUser(username: string): Promise<void> {
        await this.userClient.deleteUser(username);
    }

    private buildUserProfile(snapshot: firestore.QuerySnapshot): User {
        let data = snapshot.docs[0].data();
        let { username, firstName, lastName, age, profileCreatedAt, isAdmin, cart } = data;

        return new User(firstName, lastName, username, age, profileCreatedAt, isAdmin, cart)
    }
}