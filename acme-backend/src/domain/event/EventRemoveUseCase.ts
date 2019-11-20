import { inject, injectable } from 'inversify';
import { IEventRepository } from './IEventRepository';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../config/container';

@injectable()
export class EventRemoveUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.EventRepository) private repo: IEventRepository
    ) { }

    public async execute(id: number): Promise<void> {

        await this.repo.remove(id);

    }
}