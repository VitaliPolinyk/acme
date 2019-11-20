import { ICommentRepository } from '../../domain/comment/ICommentRepository';
import { ICommentEntity } from '../../domain/comment/CommentEntity';
import { injectable } from 'inversify';
import * as _ from 'lodash';

@injectable()
export class CommentInmemoryRepository implements ICommentRepository {

    protected data: ICommentEntity[] = [];

    constructor() {}

    public async getById(id: number) {
        return _.find(this.data, { id: id });
    }

    public async findOne(criteria: any) {
        return _.find(this.data, criteria);
    }

    public async create(comment: ICommentEntity): Promise<ICommentEntity> {

        let record: ICommentEntity = { ...comment };
        const datetime = new Date();
        record.createdAt = datetime;
        record.updatedAt = datetime;
        record.id = this.getNextId();

        this.data.push(record);

        return record;
    }

    public async update(id: number, comment: Partial<ICommentEntity>): Promise<void> {
        let record = _.find(this.data, { id: id });

        if (record) {
            record = _.merge(record, comment);
            record.updatedAt = new Date();
        }
    }

    public async find(criteria: any = {}): Promise<ICommentEntity[]> {
        return _.filter(this.data, criteria);
    }

    public async getAll(): Promise<ICommentEntity[]> {
        return this.data;
    }

    public async remove(id: number): Promise<void> {
        _.remove(this.data, function(record) {
            return record.id === id;
        });
    }

    private getNextId(): number {
        const record = _.maxBy(this.data, 'id');
        return _.get(record, 'id') ? record.id + 1 : 1;
    }
}