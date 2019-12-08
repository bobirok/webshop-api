import express from 'express';
import { Authentication } from '../middleware/auth';
import { CartHandler } from '../handlers/cart-handler';

const router = express.Router();
const auth = Authentication;
const cartHandler = new CartHandler();

router.get('/cart', auth.authenticate, async (req, res) => {
    await cartHandler.getCartProducts(req, res);
})

router.post('/cart/:productid', auth.authenticate, async (req, res) => {
    await cartHandler.addProductToUserCart(req, res);
})

module.exports = router;