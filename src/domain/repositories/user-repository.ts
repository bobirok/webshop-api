import { UserDataClient } from "../../infrastructure/user-data-client";
import { User } from "../user";
import { firestore } from "firebase";

export class UserRepository {
    private userClient = new UserDataClient();

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

        return new User(firstName, lastName, username, age, Date.now())
    }
}