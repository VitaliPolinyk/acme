import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../config/container';
import { ICommentRepository } from './ICommentRepository';

@injectable()
export class CommentRemoveUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.CommentRepository) private repo: ICommentRepository
    ) { }

    public async execute(id: number): Promise<void> {
        await this.repo.remove(id);
    }
}