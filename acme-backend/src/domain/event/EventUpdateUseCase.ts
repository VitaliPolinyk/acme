import { inject, injectable } from 'inversify';
import { IEventRepository } from './IEventRepository';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../config/container';
import { NotFoundError, InternalServerError } from 'routing-controllers';
import { EventUpdateDto } from './EventDto';
import { EventMap } from './EventMap';

@injectable()
export class EventUpdateUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.EventRepository) private repo: IEventRepository
    ) { }

    public async execute(id: number, update: EventUpdateDto): Promise<void> {
        const event = await this.repo.getById(id);

        if (!event) {
            throw new NotFoundError();
        }

        const eventUpdate = EventMap.toDomain(update);

        await this.repo.update(id, eventUpdate);
    }
}