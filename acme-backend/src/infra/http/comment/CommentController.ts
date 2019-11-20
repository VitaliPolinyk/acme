import * as _ from 'lodash';
import { injectable, inject } from 'inversify';
import { Controller } from '../Controller';
import { ILogger } from '../../../domain/ILogger';
import { TYPES } from '../../../config/container';
import { JsonController, Get, Param, NotFoundError, Post, Put, Delete, HttpCode, Body, Authorized, State, QueryParam, QueryParams, ForbiddenError } from 'routing-controllers';
import { IEventRepository } from '../../../domain/event/IEventRepository';
import { EventDto } from '../../../domain/event/EventDto';
import { IUserEntity } from '../../../domain/user/UserEntity';
import { ResponseSchema } from 'routing-controllers-openapi';
import { ICommentRepository } from '../../../domain/comment/ICommentRepository';
import { CommentCreateUseCase } from '../../../domain/comment/CommentCreateUseCase';
import { CommentUpdateUseCase } from '../../../domain/comment/CommentUpdateUseCase';
import { CommentRemoveUseCase } from '../../../domain/comment/CommentRemoveUseCase';
import { CommentDto, CommentCreateDto, CommentUpdateDto } from '../../../domain/comment/CommentDto';
import { CommentMap } from '../../../domain/comment/CommentMap';


@injectable()
@JsonController()
export class CommentController extends Controller {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.CommentRepository) private commentRepository: ICommentRepository,
        @inject(TYPES.EventRepository) private eventRepository: IEventRepository,
        @inject(CommentCreateUseCase) private commentCreateUseCase: CommentCreateUseCase,
        @inject(CommentUpdateUseCase) private commentUpdateUseCase: CommentUpdateUseCase,
        @inject(CommentRemoveUseCase) private commentRemoveUseCase: CommentRemoveUseCase
    ) {
        super();
        this.logger.setPrefix('http:controller:comment');
    }

    @Authorized()
    @Get('/api/v1/comment/:commentId')
    @ResponseSchema(CommentDto)
    public async getById(
        @Param('commentId') commentId: number,
        @State('user') user: IUserEntity): Promise<CommentDto> {

        const critera: any = { id: commentId, userId: user.id };

        const comment = await this.commentRepository.findOne(critera);

        if (!comment) {
            throw new NotFoundError(`Not found.`);
        }

        return CommentMap.toDto(comment);
    }

    @Authorized()
    @Get('/api/v1/event/:eventId/comment')
    @ResponseSchema(CommentDto, {
        description: 'A list of event comments',
        isArray: true
    })
    public async getAll(
        @Param('eventId') eventId: number,
        @State('user') user: IUserEntity): Promise<CommentDto[]> {
        const critera: any = { userId: user.id, eventId: eventId };

        const comments = await this.commentRepository.find(critera);
        return comments.map(CommentMap.toDto);
    }

    @Authorized()
    @HttpCode(201)
    @Post('/api/v1/event/:eventId/comment')
    @ResponseSchema(CommentDto)
    public async create(
        @Param('eventId') eventId: number,
        @Body() dto: CommentCreateDto,
        @State('user') user: IUserEntity): Promise<CommentDto> {

        const critera = { userId: user.id, id: eventId };
        const event = await this.eventRepository.findOne(critera);

        if (!event) {
            throw new NotFoundError(`Not found.`);
        }

        dto.eventId = eventId;
        dto.userId = user.id;

        const comment = await this.commentCreateUseCase.execute(dto);
        return CommentMap.toDto(comment);
    }

    @Authorized()
    @Put('/api/v1/event/:eventId/comment/:commentId')
    @ResponseSchema(CommentDto)
    public async update(
        @State('user') user: IUserEntity,
        @Param('eventId') eventId: number,
        @Param('commentId') commentId: number,
        @Body() dto: CommentUpdateDto): Promise<CommentDto> {

        let comment = await this.commentRepository.findOne({ id: commentId, eventId: eventId });

        if (!comment) {
            throw new NotFoundError(`Not found.`);
        }

        if (comment.userId !== user.id) {
            throw new ForbiddenError('Action is forbidden!');
        }

        await this.commentUpdateUseCase.execute(commentId, dto);

        const record = await this.commentRepository.getById(commentId);

        return CommentMap.toDto(record);
    }

    @Authorized()
    @Delete('/api/v1/event/:eventId/comment/:commentId')
    public async remove(
        @State('user') user: IUserEntity,
        @Param('eventId') eventId: number,
        @Param('commentId') commentId: number): Promise<any> {

        let comment = await this.commentRepository.findOne({ id: commentId, eventId: eventId });

        if (!comment) {
            throw new NotFoundError(`Not found.`);
        }

        if (comment.userId !== user.id) {
            throw new ForbiddenError('Action is forbidden!');
        }

        await this.commentRemoveUseCase.execute(commentId);
        return {};
    }

}