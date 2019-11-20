import { IRepository } from '../IRepository';
import { IUserEntity } from './UserEntity';

export interface IUserRepository extends IRepository<IUserEntity> {}