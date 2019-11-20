import * as moment from 'moment';
import { Mapper } from '../Mapper';
import { IUserEntity, UserEntity } from './UserEntity';
import { UserDto } from './UserDto';

export class UserMap extends Mapper<IUserEntity> {
    public static toDomain(raw: UserDto): IUserEntity {
        if (!raw) return null;

        const entity = new UserEntity();
        entity.id = raw.id;
        entity.email = raw.email;

        return entity;
    }

    public static toDto (entity: IUserEntity): UserDto {
        if (!entity) return null;

        const dto = new UserDto();
        dto.id = entity.id;
        dto.email = entity.email;
        if (entity.token) {
            dto.token = entity.token;
        }
        dto.createdAt = moment.utc(entity.createdAt).toISOString() || null;
        dto.updatedAt = moment.utc(entity.updatedAt).toISOString() || null;

        return dto;
    }
}