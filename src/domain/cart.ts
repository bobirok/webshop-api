import { Product } from "./product";

export class Cart {
    private _total: number = 0;

    constructor(
        public readonly products: Product[] = [],
    ) 
    {}

    get total(): number {
        this._total = this.calculateTotalPrice();

        return this._total;
    }

    private calculateTotalPrice(): number {
        let total: number = 0;

        this.products.forEach((p: Product) => {
            total += +p.price;
        })
        return total;
    }
}