import { User } from "./user";

export class Product {
    public readonly slug: string;

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly price: number,
        public readonly image: string,
        public readonly quantity: number,
        public readonly dateAdded: number,
    )
    {
        this.slug = name.replace(' ', '-')
    }
}