import * as jwt from 'jsonwebtoken';
import { UserRepository } from "../../../src/domain/repositories/user-repository"
import { User } from "../../../src/domain/user";
import { Cart } from "../../../src/domain/cart";
import { UserFactory } from '../../../src/domain/user-factory';

require('dotenv').config();

test('Should register a new user', async () => {
    // given
    const userRepository = new UserRepository();
    const user = UserFactory.createFakeUser();
    const password = 'fakePassword';

    // when
    const registeredUserToken = await userRepository.registerUser(user, password);

    const jsonedRegisteredUsername = (JSON.parse(registeredUserToken));

    // then
    expect(jsonedRegisteredUsername.username).toEqual(user.username);
    await userRepository.deleteUser(user.username);
})

test('Should log in a user', async () => {
    // given
    const userRepository = new UserRepository();
    const user = UserFactory.createFakeUser();
    const password = 'fakePassword';
    const registeredUserToken = await userRepository.registerUser(user, password);

    // when
    const loggedInUserToken = await userRepository.loginUser(user.username, password);
    const verifiedJWTUsername = JSON.stringify(jwt.verify(loggedInUserToken, process.env.JWT_SECRET_KEY!));
    const jsonedVerifiedJWTUsername = JSON.parse(verifiedJWTUsername);

    // then
    expect(jsonedVerifiedJWTUsername.username).toBe('fakeUsername');
    await userRepository.deleteUser(user.username);
})