import { Product } from "./product";

export class User {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly username: string,
        public readonly age: number,
        public readonly profileCreatedAt: number,
        public readonly products: Product[]
    )
    {}
}