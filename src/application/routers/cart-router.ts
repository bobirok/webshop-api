import express from 'express';
import { Authentication } from '../middleware/auth';
import { CartHandler } from '../handlers/cart-handler';

const router = express.Router();
const auth = Authentication;
const cartHandler = new CartHandler();

router.get('/cart', auth.authenticate, async (req, res) => {
    await cartHandler.getCartProductsHandler(req, res);
})

router.post('/cart/:productid', auth.authenticate, async (req, res) => {
    await cartHandler.addProductToUserCartHandler(req, res);
})

router.delete('/cart/:productid', auth.authenticate, async (req, res) => {
    await cartHandler.removeProductFromCartHandler(req, res);
})

module.exports = router;