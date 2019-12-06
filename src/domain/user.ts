import { Product } from "./product";
import { Cart } from "./cart";

export class User {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly username: string,
        public readonly age: number,
        public readonly profileCreatedAt: number,
        public readonly isAdmin: boolean = false,
        public readonly cart: Cart
    )
    {}
}