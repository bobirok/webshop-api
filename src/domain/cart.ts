import { Product } from "./product";

export class Cart {
    public readonly total: number = 0;

    constructor(
        public readonly products: Product[] = []
    ) 
    {
        this.total = this.calculateTotalPrice();
    }

    private calculateTotalPrice(): number {
        let total = 0;

        this.products.forEach(p => {
            total += p.price;
        })

        return total;
    }
}