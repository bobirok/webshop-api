const express = require('express');
import { UserRepository } from '../../domain/repositories/user-repository';
import { User } from '../../domain/user';
const router = express.Router();
const userRepository = new UserRepository();


router.get('/register', async (req: any, res: any) => {
    let firstName = req.query.firstname;
    let lastName = req.query.lastname;
    let username = req.query.username;
    let age = req.query.age;
    let createdAt = Date.now();
    let password = req.query.password;

    let user = new User(firstName, lastName, username, parseInt(age), createdAt);

    try {
        let token = await userRepository.registerUser(user, password);
        return res.status(200).send(token);
    }
    catch(e) {
        return res.status(400).send(e)
    }
})

router.get('/login', async (req: any, res: any) => {
    let username: string = req.query.username;
    let password: string = req.query.password;

    try {
        let token = await userRepository.loginUser(username, password);

        return res.status(200).send(token);
    }
    catch(e) {
        return res.status(400).send(e)
    }
})

router.get('/logout', async (req: any, res:any) => {
    let token = req.query.token;

    try {
        await userRepository.logOutUser(token);

        return res.status(200).send('LogedOut');
    }
    catch(e) {
        return res.status(400).send(e);
    }
})

module.exports = router