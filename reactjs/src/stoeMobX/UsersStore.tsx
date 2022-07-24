import {makeAutoObservable} from "mobx";
import axios from "axios";

export type UserType = {
    id?: number,
    lastName: string,
    firstName: string,
    age: number
};

export interface UsersStoreInterface {
    init(apiUrl: string) : void;
    setUsers(users: UserType[]): void;
    getUsers() : UserType[]
    deleteUser(id: number) : void
}

export default new class UsersStore implements UsersStoreInterface {
    protected apiUrl:string = '';

    protected users:UserType[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    public async init(apiUrl: string) {
        this.apiUrl = apiUrl;

        const data = await axios.get(`${apiUrl}/user`);

        this.setUsers(data.data);
    }

    public setUsers(users: UserType[]) : void {
        this.users = users;
    }

    public getUsers() : UserType[] {
        return this.users;
    }

    public async deleteUser(id: number)
    {
        await axios.delete(`${this.apiUrl}/user/${id}`);

        this.setUsers(
            this.getUsers().filter((user: UserType) => user.id !== id)
        );
    }
}