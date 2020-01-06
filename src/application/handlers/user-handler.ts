import { UserRepository } from "../../domain/repositories/user-repository";
import { UserFactory } from '../../domain/user-factory';

export class UserHandler {
    private userRepository = new UserRepository();

    public async register(req: any, res: any): Promise<any> {
        let password = req.query.password;

        let user = UserFactory.createUser(req);

        try {
            let token = await this.userRepository.registerUser(user, password);
            return res.status(200).send(token);
        }
        catch (e) {
            return res.status(400).send(e.message)
        }
    }

    public async logIn(req: any, res: any): Promise<any> {
        const { username, password } = req.query;
    
        try {
            let token = await this.userRepository.loginUser(username, password);
    
            return res.status(200).send(token);
        }
        catch(e) {
            return res.status(400).send(e.message)
        }
    }

    public async logOut(req: any, res: any): Promise<any> {
        let username: string = req.username;

        try {
            await this.userRepository.logOutUser(username);

            return res.status(200).send('Loged Out');
        }
        catch (e) {
            return res.status(400).send(e.message);
        }
    }

    public async getProfile(req: any, res: any): Promise<any> {
        let username: string = req.username;

        try {
            let user = await this.userRepository.getUser(username)

            return res.status(200).send(user);
        }
        catch(e) {
            return res.status(401).send(e.message)
        }
    }
}