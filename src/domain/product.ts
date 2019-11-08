import { User } from "./user";

export class Product {
    constructor(
        public readonly name: string,
        public readonly quantity: number,
        public readonly dateAdded: number,
        public readonly createdBy: User
    )
    {}
}