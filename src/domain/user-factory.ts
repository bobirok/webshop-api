import { User } from "./user";
import { Cart } from "./cart";

export class UserFactory {
    public static createUser(req: any): User {
        let firstName = req.query.firstname;
        let lastName = req.query.lastname;
        let username = req.query.username;
        let age = req.query.age;
        let createdAt = Date.now();
        let cart: Cart = new Cart();

        return new User(firstName, lastName, username, parseInt(age), createdAt, false, cart);
    }
}