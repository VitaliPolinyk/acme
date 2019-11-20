import { Mapper } from '../Mapper';
import { ICommentEntity, CommentEntity } from './CommentEntity';
import { CommentDto } from './CommentDto';
import moment = require('moment');

export class CommentMap extends Mapper<ICommentEntity> {
    public static toDomain(raw: CommentDto): ICommentEntity {
        if (!raw) return null;

        const entity = new CommentEntity();
        entity.id = raw.id;
        entity.eventId = raw.eventId;
        entity.userId = raw.userId;
        entity.text = raw.text;

        return entity;
    }

    public static toDto (entity: ICommentEntity): CommentDto {
        if (!entity) return null;

        const dto = new CommentDto();
        dto.id = entity.id;
        dto.eventId = entity.eventId;
        dto.userId = entity.userId;
        dto.text = entity.text;
        dto.createdAt = moment.utc(entity.createdAt).toISOString() || null;
        dto.updatedAt = moment.utc(entity.updatedAt).toISOString() || null;

        return dto;
    }
}