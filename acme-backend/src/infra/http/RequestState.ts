import { injectable, inject } from 'inversify';
import { IUserEntity } from '../../domain/user/UserEntity';

@injectable()
export class RequestState {
    private _requestId: string;
    private _user: IUserEntity;
    constructor() { }

    get requestId(): string {
        return this._requestId;
    }

    set requestId(value: string) {
        this._requestId = value;
    }

    get user(): IUserEntity {
        return this._user;
    }

    set user(value: IUserEntity) {
        this._user = value;
    }
}