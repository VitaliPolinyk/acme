import { inject, injectable } from 'inversify';
import { IUserRepository } from './IUserRepository';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../config/container';
import { UserEntity } from './UserEntity';
import { BadRequestError } from 'routing-controllers';
import { AuthService, ITokenUser } from './AuthService';
import { UserLoginDto } from './UserDto';

@injectable()
export class UserLoginUseCase implements IUseCase<UserEntity> {
    constructor(
        @inject(TYPES.AuthService) private auth: AuthService,
        @inject(TYPES.UserRepository) private repo: IUserRepository
    ) { }

    public async execute(dto: UserLoginDto): Promise<UserEntity> {

        const user = await this.repo.findOne({ email: dto.email });
        
        if (!user) {
            throw new BadRequestError('Email or password is incorrect!');
        }

        try {
            await this.auth.comparePasswords(dto.password, user.password);

            const entity = new UserEntity();
            entity.id = user.id;
            entity.email = user.email;
            entity.token = this.auth.signToken({ id: user.id });

            return entity;
        } catch (err) {
            throw new BadRequestError('Email or password is incorrect!');
        }

    }
}