import { IEventRepository } from '../../domain/event/IEventRepository';
import { IEventEntity } from '../../domain/event/EventEntity';
import { injectable, inject } from 'inversify';
import * as _ from 'lodash';
import { TYPES } from '../../config/container';
import { ICommentRepository } from '../../domain/comment/ICommentRepository';

@injectable()
export class EventInmemoryRepository implements IEventRepository {

    protected data: IEventEntity[] = [];

    constructor(
        @inject(TYPES.CommentRepository) private commentRepository: ICommentRepository,
    ) { }

    public async getById(id: number) {
        return _.find(this.data, { id: id });
    }

    public async findOne(criteria: any, options: { relations: string[] } = null) {
        const event = _.find(this.data, criteria);

        if (event && options && options.relations === ['comment']) {
            const comments = await this.commentRepository.find({ eventId: event.id });
            event.comments = comments || [];
        }

        return event;
    }

    public async create(event: IEventEntity): Promise<IEventEntity> {

        let record: IEventEntity = { ...event };
        const now = new Date();
        record.createdAt = now;
        record.updatedAt = now;
        record.id = this.getNextId();

        this.data.push(record);

        return record;
    }

    public async update(id: number, event: Partial<IEventEntity>): Promise<void> {
        let record = _.find(this.data, { id: id });

        if (record) {
            record = _.merge(record, event);
            record.updatedAt = new Date();
        }
    }

    public async find(criteria: any = {}, options: { relations: string[] } = null): Promise<IEventEntity[]> {
        const events = _.filter(this.data, criteria);

        if (events && options && options.relations === ['comment']) {
            for await (let event of events) {
                event.comments = await this.commentRepository.find({eventId: event.id});
            }
        }

        return events;
    }

    public async getAll(): Promise<IEventEntity[]> {
        return this.data;
    }

    public async remove(id: number): Promise<void> {
        _.remove(this.data, function (record) {
            return record.id === id;
        });

        const comments = await this.commentRepository.find({ eventId: id });

        if (comments && comments.length) {
            for await (let comment of comments) {
                await this.commentRepository.remove(comment.id);
            }
        }
    }

    private getNextId(): number {
        const record = _.maxBy(this.data, 'id');
        return _.get(record, 'id') ? record.id + 1 : 1;
    }
}