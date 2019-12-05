import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
const userRouter = require('./routers/user-router')
const productRouter = require('./routers/product-router')

const app = express();
const port = 3000;

app.use(cors());
app.use(userRouter);
app.use(productRouter);
app.use(bodyParser.json());

app.listen(port, () => {
    console.log('Listening');
})