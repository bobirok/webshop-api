import { User } from "./user";

export class Product {
    public readonly slug: string;

    constructor(
        public readonly name: string,
        public readonly quantity: number,
        public readonly dateAdded: number,
        public readonly createdBy: User
    )
    {
        this.slug = createdBy.username + '-' + name.replace(' ', '-')
    }
}