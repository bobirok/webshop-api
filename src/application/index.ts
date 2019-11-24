import { ProductsRepository } from "../domain/repositories/products-repository";
import { Product } from "../domain/product";
import { UserRepository } from "../domain/repositories/user-repository";
import { User } from "../domain/user";
import express from 'express';
import cors from 'cors'

const app = express();
app.use(cors())
app.use(express.static(__dirname))
const port = 3000;

const productRepository = new ProductsRepository();
const userRepository = new UserRepository();

app.get('/products', async (req, res) => {

    try {
        let products: Product[] = await productRepository.getProducts();

        res.status(200)
        return res.send(products)
    }
    catch (e) {
        res.status(400)
        res.send(e)
    }
})

app.get('/register', async (req, res) => {
    let firstName = req.body.firstname;
    let lastName = req.body.lastname;
    let username = req.body.username;
    let age = req.body.age;
    let createdAt = Date.now();
    let password = req.body.password;

    let user = new User(firstName, lastName, username, age, createdAt);

    try {
        let token = await userRepository.registerUser(user, password);
        localStorage.setItem(token, token);
        res.status(200);
        return res.send('OK');
    }
    catch(e) {
        res.status(400);
        return res.send(e)
    }
})




app.listen(port, () => {
    console.log('Listening');
})