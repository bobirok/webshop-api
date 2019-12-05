import { User } from "../../domain/user";
import { UserRepository } from "../../domain/repositories/user-repository";

export class UserHandler {
    private userRepository = new UserRepository();

    public async register(req: any, res: any): Promise<any> {
        let firstName = req.query.firstname;
        let lastName = req.query.lastname;
        let username = req.query.username;
        let age = req.query.age;
        let createdAt = Date.now();
        let password = req.query.password;

        let user = new User(firstName, lastName, username, parseInt(age), createdAt);

        try {
            let token = await this.userRepository.registerUser(user, password);
            return res.status(200).send(token);
        }
        catch (e) {
            return res.status(400).send(e)
        }
    }

    public async logIn(req: any, res: any): Promise<any> {
        let username: string = req.query.username;
        let password: string = req.query.password;
    
        try {
            let token = await this.userRepository.loginUser(username, password);
    
            return res.status(200).send(token);
        }
        catch(e) {
            return res.status(400).send(e)
        }
    }

    public async logOut(req: any, res: any): Promise<any> {
        let token = req.query.token;

        try {
            await this.userRepository.logOutUser(token);

            return res.status(200).send('Loged Out');
        }
        catch (e) {
            return res.status(400).send(e);
        }
    }

    public async getProfile(req: any, res: any): Promise<any> {
        let username: string = req.username;

        try {
            let user = await this.userRepository.getUser(username)

            return res.status(200).send(user);
        }
        catch(e) {
            return res.status(401).send(e)
        }
    }
}