import {DeleteResult, Like, Repository} from "typeorm";
import { AppDataSource } from "../data-source";
import {User} from "../entity/User";

type UserType = {
    id?: number
    firstName: string,
    lastName: string,
    age: number,
};

export class UserService {
    userRepository: Repository<User>

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    public async getAllUsersCount() {
        return await this.userRepository.count();
    }

    public async findUserByFirstName(firstName: string) : Promise<User[]> {
        return await this.userRepository.findBy({firstName: Like(`%${firstName}%`)})
    }

    public async findUserByFullName(name: string) : Promise<User[]> {
        return this.userRepository
            .createQueryBuilder('u')
            .select('u')
            .where(`CONCAT(u.firstName, ' ', u.lastName) like :name`, {name: `%${name}%`})
            .getMany()
    }

    public async saveUser(data: UserType) : Promise<User> {
        let user = new User()

        if (data.id) {
            user = await this.userRepository.findOneBy( { id: data.id } )
        }

        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.age = data.age;

        return await this.userRepository.save(user)
    }

    public async deleteById(id: string) : Promise<DeleteResult> {
        return await this.userRepository.delete({id: parseInt(id)})
    }
}