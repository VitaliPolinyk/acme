import { CommentEntity } from '../comment/CommentEntity';

export interface IEventEntity {
    id?: number;
    userId?: number;
    title?: string;
    datetime?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    comments?: CommentEntity[];
}

export class EventEntity implements IEventEntity {
    id: number;
    userId: number;
    title: string;
    datetime?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    comments?: CommentEntity[];

    constructor() { }
}