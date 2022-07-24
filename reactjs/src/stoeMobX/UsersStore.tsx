import {makeAutoObservable} from "mobx";
import axios from "axios";

export type UserType = {
    id?: number,
    lastName: string,
    firstName: string,
    age: number
};

export interface UsersStoreInterface {
    selectedUser:UserType;
    init(apiUrl: string) : void;
    addUser(user: UserType): void;
    setUsers(users: UserType[]): void;
    getUsers() : UserType[]
    setSelectedUser(user: UserType, updateInMainObject?:boolean): void;
    getSelectedUser() : UserType
    clearSelectedUser(): void;
    deleteUser(id: number) : void
}

export default new class UsersStore implements UsersStoreInterface {
    protected apiUrl:string = '';

    protected users:UserType[] = [];

    public selectedUser:UserType = {
        lastName: '',
        firstName: '',
        age: 0,
    };

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

    public addUser(user: UserType): void {
        this.users.unshift(user);
    }

    setSelectedUser(user: UserType, updateInMainObject?:boolean): void {
        this.selectedUser = user;

        if (updateInMainObject) {
            const users = this.getUsers().map((userObj: UserType) => {
                if (userObj.id === this.selectedUser?.id) {
                    return this.selectedUser;
                }

                return userObj;
            });

            this.setUsers(users as UserType[]);
        }
    }

    getSelectedUser(): UserType {
        return this.selectedUser;
    }

    public clearSelectedUser(): void {
        this.setSelectedUser({
            lastName: '',
            firstName: '',
            age: 0,
        }, true);
    }

    public async deleteUser(id: number)
    {
        await axios.delete(`${this.apiUrl}/user/${id}`);

        this.setUsers(
            this.getUsers().filter((user: UserType) => user.id !== id)
        );
    }
}