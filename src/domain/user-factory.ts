import { User } from "./user";
import { Cart } from "./cart";

export class UserFactory {
    public static createUser(req: any): User {
        const { firstName, lastName, username, age } = req.query;
        const createdAt = Date.now();
        const cart: Cart = new Cart();

        return new User(firstName, lastName, username, parseInt(age), createdAt, false, cart);
    }

    public static createFakeUser(): User {
        return new User('fakeName', 'fakeLastName', 'fakeUsername', 20, Date.now(), false, new Cart([]));
    }
}