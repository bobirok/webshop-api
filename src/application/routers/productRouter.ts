import express from 'express';
import { Product } from '../../domain/product';
import { ProductsRepository } from '../../domain/repositories/products-repository';
const router = express.Router();

const productRepository = new ProductsRepository();

router.get('/products', async (req, res) => {
    try {
        let products: Product[] = await productRepository.getProducts();

        res.status(200)
        return res.send(products)
    }
    catch (e) {
        res.status(400)
        console.log(e)
        return res.send(e)
    }
})

module.exports = router