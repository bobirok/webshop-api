import express from 'express';
import { Authentication } from '../middleware/auth';
import { ProductHandler } from '../handlers/product-handler';

const auth = Authentication;
const router = express.Router();
const productHandler = new ProductHandler();

router.post('/products', auth.authenticateAdministrator, async (req, res) => {
    return await productHandler.createProduct(req, res);
})

router.get('/products' , async (req, res) => {
    return await productHandler.getAllProducts(req, res);
})

router.get('/products/:id', auth.authenticate, async (req, res) => {
    return await productHandler.getProduct(req, res);
})

router.post('/products/delete/:id', auth.authenticateAdministrator, async (req, res) => {
    return await productHandler.deleteProduct(req, res);
})

module.exports = router