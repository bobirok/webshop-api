import { UserDataClient } from "../../infrastructure/user-data-client";
import { User } from "../user";

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
}