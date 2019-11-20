import { inject, injectable } from 'inversify';
import { IEventRepository } from './IEventRepository';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../config/container';
import { IEventEntity } from './EventEntity';
import { EventCreateDto } from './EventDto';
import { EventMap } from './EventMap';

@injectable()
export class EventCreateUseCase implements IUseCase<IEventEntity> {
    constructor(
        @inject(TYPES.EventRepository) private repo: IEventRepository
    ) { }

    public async execute(event: EventCreateDto): Promise<IEventEntity> {
        const entity = EventMap.toDomain(event);

        return await this.repo.create(entity);
    }
}