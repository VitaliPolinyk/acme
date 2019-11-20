import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../config/container';
import { ICommentEntity } from './CommentEntity';
import { ICommentRepository } from './ICommentRepository';
import { CommentCreateDto } from './CommentDto';
import { CommentMap } from './CommentMap';

@injectable()
export class CommentCreateUseCase implements IUseCase<ICommentEntity> {
    constructor(
        @inject(TYPES.CommentRepository) private repo: ICommentRepository
    ) { }

    public async execute(comment: CommentCreateDto): Promise<ICommentEntity> {
        const entity = CommentMap.toDomain(comment);
        return this.repo.create(entity);
    }

}