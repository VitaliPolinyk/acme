import * as moment from 'moment';
import { Mapper } from '../Mapper';
import { IEventEntity, EventEntity } from './EventEntity';
import { EventDto } from './EventDto';
import { CommentMap } from '../comment/CommentMap';

export class EventMap extends Mapper<IEventEntity> {
    public static toDomain(raw: EventDto): IEventEntity {
        if (!raw) return null;

        const entity = new EventEntity();
        entity.id = raw.id;
        entity.userId = raw.userId;

        if (typeof raw.title !== 'undefined') {
            entity.title = raw.title;
        }

        if (raw.datetime) {
            entity.datetime = new Date(raw.datetime);
        }

        if (raw.comments) {
            entity.comments = raw.comments.map(record => CommentMap.toDomain(record));
        }

        return entity;
    }

    public static toDto(entity: IEventEntity): EventDto {
        if (!entity) return null;

        const dto = new EventDto();
        dto.id = entity.id;
        dto.userId = entity.userId;
        dto.title = entity.title;
        dto.datetime = moment.utc(entity.datetime).toISOString() || null;
        dto.createdAt = moment.utc(entity.createdAt).toISOString() || null;
        dto.updatedAt = moment.utc(entity.updatedAt).toISOString() || null;

        if (entity.comments) {
            dto.comments = entity.comments.map(record => CommentMap.toDto(record));
        }

        return dto;
    }
}