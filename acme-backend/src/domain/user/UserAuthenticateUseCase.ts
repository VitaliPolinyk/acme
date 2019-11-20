import { inject, injectable } from 'inversify';
import { IUserRepository } from './IUserRepository';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../config/container';
import { UserEntity } from './UserEntity';
import { UnauthorizedError } from 'routing-controllers';
import { AuthService, ITokenUser } from './AuthService';

@injectable()
export class UserAuthenticateUseCase implements IUseCase<UserEntity> {
    constructor(
        @inject(TYPES.AuthService) private auth: AuthService,
        @inject(TYPES.UserRepository) private repo: IUserRepository
    ) { }

    public async execute(token: string): Promise<UserEntity> {
        
        let decoded: ITokenUser = await this.auth.verifyToken(token);

        const user = await this.repo.findOne({ id: decoded.id });

        if (!user) {
            throw new UnauthorizedError('Access token is invalid!');
        }

        const entity = new UserEntity();
        entity.id = user.id;
        entity.email = user.email;
        return entity;
    }
}