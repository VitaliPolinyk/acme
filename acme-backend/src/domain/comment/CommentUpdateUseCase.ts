import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../config/container';
import { NotFoundError } from 'routing-controllers';
import { ICommentRepository } from './ICommentRepository';
import { CommentUpdateDto } from './CommentDto';

@injectable()
export class CommentUpdateUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.CommentRepository) private repo: ICommentRepository
    ) { }

    public async execute(id: number, comment: CommentUpdateDto): Promise<void> {

        const foundComment = await this.repo.getById(id);

        if (!foundComment) {
            throw new NotFoundError();
        }

        await this.repo.update(id, comment);
    }
}