import { IRepository } from '../IRepository';
import { ICommentEntity } from './CommentEntity';

export interface ICommentRepository extends IRepository<ICommentEntity> {}