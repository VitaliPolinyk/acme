import { IUserRepository } from '../../domain/user/IUserRepository';
import { IUserEntity } from '../../domain/user/UserEntity';
import { injectable } from 'inversify';
import * as _ from 'lodash';

@injectable()
export class UserInmemoryRepository implements IUserRepository {

    // default data, just for demo purposes
    protected data: IUserEntity[] = [];

    constructor() {}

    public async getById(id: number) {
        return _.find(this.data, { id: id });
    }

    public async findOne(criteria: any) {
        return _.find(this.data, criteria);
    }

    public async create(user: IUserEntity): Promise<IUserEntity> {

        let record: IUserEntity = { ...user };
        const datetime = new Date();
        record.createdAt = datetime;
        record.updatedAt = datetime;
        record.id = this.getNextId();

        this.data.push(record);

        return record;
    }

    public async update(id: number, user: Partial<IUserEntity>): Promise<void> {
        let record = _.find(this.data, { id: id });

        if (record) {
            record = _.merge(record, user);
            record.updatedAt = new Date();
        }
    }

    public async find(criteria: any = {}): Promise<IUserEntity[]> {
        return _.filter(this.data, criteria);
    }

    public async getAll(): Promise<IUserEntity[]> {
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