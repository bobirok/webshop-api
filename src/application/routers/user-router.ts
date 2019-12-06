import { UserHandler } from '../handlers/user-handler'
import { Authentication } from '../middleware/auth';

const express = require('express');
const router = express.Router();

const userHandler = new UserHandler();
const auth = Authentication;

router.post('/register', async (req: any, res: any) => {
    return await userHandler.register(req, res);
})

router.post('/login', async (req: any, res: any) => {
    return await userHandler.logIn(req, res);
})

router.post('/logout', async (req: any, res: any) => {
    return await userHandler.logOut(req, res);
})

router.get('/me', auth.authenticate ,async (req: any, res: any) => {
    return await userHandler.getProfile(req, res);
})

router.post('/add', auth.authenticate, async (req: any, res: any) => {
    return await userHandler.addProductToUserCart(req, res);
})

module.exports = router