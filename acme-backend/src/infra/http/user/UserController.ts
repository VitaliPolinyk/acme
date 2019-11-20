import * as _ from 'lodash';
import { injectable, inject } from 'inversify';
import { Controller } from '../Controller';
import { ILogger } from '../../../domain/ILogger';
import { TYPES } from '../../../config/container';
import { JsonController, Get, Param, NotFoundError, Post, Put, Delete, HttpCode, Body, Authorized, State, QueryParam, QueryParams, UnauthorizedError } from 'routing-controllers';
import { IUserEntity } from '../../../domain/user/UserEntity';
import { ResponseSchema } from 'routing-controllers-openapi';
import { UserDto, UserLoginDto } from '../../../domain/user/UserDto';
import { IUserRepository } from '../../../domain/user/IUserRepository';
import { UserMap } from '../../../domain/user/UserMap';
import { UserLoginUseCase } from '../../../domain/user/UserLoginUseCase';

@injectable()
@JsonController()
export class UserController extends Controller {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
        @inject(UserLoginUseCase) private userLoginUseCase: UserLoginUseCase
    ) {
        super();
        this.logger.setPrefix('http:controller:user');
    }

    @Authorized()
    @Get('/api/v1/user/:userId')
    @ResponseSchema(UserDto)
    public async getById(
        @Param('userId') userId: number,
        @State('user') user: IUserEntity): Promise<UserDto> {

        if (userId !== user.id) {
            throw new UnauthorizedError('It is not allowed!');
        }

        const record = await this.userRepository.getById(userId);

        if (!record) {
            throw new NotFoundError(`Not found.`);
        }

        return UserMap.toDto(record);
    }

    @HttpCode(200)
    @Post('/api/v1/login')
    @ResponseSchema(UserDto)
    public async login(@Body() dto: UserLoginDto): Promise<UserDto> {

        const user = await this.userLoginUseCase.execute(dto);
        return UserMap.toDto(user);
    }

}