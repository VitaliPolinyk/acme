import * as _ from 'lodash';
import { injectable, inject } from 'inversify';
import { Controller } from '../Controller';
import { ILogger } from '../../../domain/ILogger';
import { TYPES } from '../../../config/container';
import { JsonController, Get, Param, NotFoundError, Post, Put, Delete, HttpCode, Body, Authorized, State, QueryParam, QueryParams, ForbiddenError } from 'routing-controllers';
import { IEventRepository } from '../../../domain/event/IEventRepository';
import { EventCreateUseCase } from '../../../domain/event/EventCreateUseCase';
import { EventCreateDto, EventUpdateDto, EventDto } from '../../../domain/event/EventDto';
import { IUserEntity } from '../../../domain/user/UserEntity';
import { EventUpdateUseCase } from '../../../domain/event/EventUpdateUseCase';
import { EventRemoveUseCase } from '../../../domain/event/EventRemoveUseCase';
import { ResponseSchema } from 'routing-controllers-openapi';
import { EventMap } from '../../../domain/event/EventMap';
import { IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

class EventQueryParams {
    @IsOptional()
    @IsString()
    @JSONSchema({
        enum: ['comment'],
        description: 'comment - include info about related comments',
        example: 'comment'
    })
    include: 'comment'
}


@injectable()
@JsonController()
export class EventController extends Controller {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.EventRepository) private eventRepository: IEventRepository,
        @inject(EventCreateUseCase) private eventCreateUseCase: EventCreateUseCase,
        @inject(EventUpdateUseCase) private eventUpdateUseCase: EventUpdateUseCase,
        @inject(EventRemoveUseCase) private eventRemoveUseCase: EventRemoveUseCase
    ) {
        super();
        this.logger.setPrefix('http:controller:event');
    }

    @Authorized()
    @Get('/api/v1/event/:eventId')
    @ResponseSchema(EventDto)
    public async getById(
        @Param('eventId') eventId: string,
        @QueryParams() query: EventQueryParams,
        @State('user') user: IUserEntity): Promise<EventDto> {

        const critera: any = { id: eventId };
        const options: any = {};
        if (query.include === 'comment') {
            options.relations = ['comment'];
        }

        const event = await this.eventRepository.findOne(critera, options);

        if (!event) {
            throw new NotFoundError(`Not found.`);
        }

        return EventMap.toDto(event);
    }

    @Authorized()
    @Get('/api/v1/event')
    @ResponseSchema(EventDto, {
        description: 'A list of events',
        isArray: true
    })
    public async getAll(
        @QueryParams() query: EventQueryParams,
        @State('user') user: IUserEntity): Promise<EventDto[]> {
        const critera: any = { };

        if (query.include === 'comment') {
            critera.relations = ['comment'];
        }

        const events = await this.eventRepository.find(critera);
        return events.map(EventMap.toDto);
    }

    @Authorized()
    @HttpCode(201)
    @Post('/api/v1/event')
    @ResponseSchema(EventDto)
    public async create(
        @Body() dto: EventCreateDto,
        @State('user') user: IUserEntity): Promise<EventDto> {

        dto.userId = user.id;
        const event = await this.eventCreateUseCase.execute(dto);
        return EventMap.toDto(event);
    }

    @Authorized()
    @Put('/api/v1/event/:eventId')
    @ResponseSchema(EventDto)
    public async update(
        @State('user') user: IUserEntity,
        @Param('eventId') eventId: number,
        @Body() dto: EventUpdateDto): Promise<EventDto> {

        let event = await this.eventRepository.findOne({ id: eventId });

        if (!event) {
            throw new NotFoundError(`Not found.`);
        }

        if (event.userId !== user.id) {
            throw new ForbiddenError('Action is forbidden!');
        }

        await this.eventUpdateUseCase.execute(eventId, dto);

        event = await this.eventRepository.getById(eventId);

        return EventMap.toDto(event);
    }

    @Authorized()
    @Delete('/api/v1/event/:eventId')
    public async remove(
        @State('user') user: IUserEntity,
        @Param('eventId') eventId: number): Promise<any> {

        let event = await this.eventRepository.findOne({ id: eventId });

        if (!event) {
            throw new NotFoundError(`Not found.`);
        }

        if (event.userId !== user.id) {
            throw new ForbiddenError('Action is forbidden!');
        }

        await this.eventRemoveUseCase.execute(eventId);
        return {};
    }

}