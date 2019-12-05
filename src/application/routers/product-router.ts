import express from 'express';
import { Authentication } from '../middleware/auth';
import { ProductHandler } from '../handlers/product-handler';

const auth = Authentication;
const router = express.Router();
const productHandler = new ProductHandler();

router.get('/products', auth.authenticate , async (req, res) => {
    return await productHandler.getAllProducts(req, res);
})

router.get('/products/:id', auth.authenticate, async (req, res) => {
    return await productHandler.getProduct(req, res).catch(console.log);
})

module.exports = router