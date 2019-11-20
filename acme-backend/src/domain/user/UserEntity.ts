export interface IUserEntity {
    id?: number;
    email: string;
    token?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class UserEntity implements IUserEntity {
    id: number;
    email: string;
    token?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor() {}
}