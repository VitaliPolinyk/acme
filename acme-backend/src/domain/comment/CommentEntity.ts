export interface ICommentEntity {
    id: number;
    eventId: number;
    userId: number;
    text: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class CommentEntity implements ICommentEntity {
    id: number;
    eventId: number;
    userId: number;
    text: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor() { }
}