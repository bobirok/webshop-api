import { Product } from "../../../src/domain/product"
import { ProductsRepository } from "../../../src/domain/repositories/products-repository"

test('Should create a new product', async () => {
    // given
    const product = new Product('12x2ssssa', 'Shoes', 111.99, 'no-image', 12, Date.now());
    const productRepository = new ProductsRepository();
    const amountOfProducts = (await productRepository.getProducts()).length;

    // when
    await productRepository.createProduct(product);
    const increasedAmountOfProducts = (await productRepository.getProducts()).length;

    // then 
    expect(increasedAmountOfProducts).toEqual(amountOfProducts + 1);
    await productRepository.deleteProduct('12x2ssssa');
})

test('Should get all products stored in the database', async () => {
    // given
    const productRepository = new ProductsRepository();

    // when
    const totalAmountOfProducts = (await productRepository.getProducts()).length;

    // then
    expect(totalAmountOfProducts).toEqual(6);
})

test('Should get a specific product by ID', async () => { 
    // given
    const productRepository = new ProductsRepository();
    const specificProductId: string = '123lccldff-22p';

    // when
    const receivedProduct = await productRepository.getProduct(specificProductId);

    // then
    expect(receivedProduct.name).toBe('Macbook');
    expect(Number(receivedProduct.price)).toBe(29.99);
    expect(receivedProduct.dateAdded).toBe(1515125);
    expect(receivedProduct.id).toBe('123lccldff-22p');
})

test('Should delete a specific product by ID', async () => {
    // given
    const productRepository = new ProductsRepository();
    const specificProductId: string = '123lccldff-22p';
    const product = await productRepository.getProduct(specificProductId);
    const amountOfProducts = (await productRepository.getProducts()).length;

    // when
    await productRepository.deleteProduct(product.id);
    const decreasedAmountOfProducts = (await productRepository.getProducts()).length;

    // then
    expect(decreasedAmountOfProducts).toEqual(amountOfProducts - 1);
    await productRepository.createProduct(product);
})