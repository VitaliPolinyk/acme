import { inject, injectable } from 'inversify';
import { TYPES } from '../../config/container';
import { ILogger } from '../../domain/ILogger';
import { IUserRepository } from '../../domain/user/IUserRepository';
import { IEventRepository } from '../../domain/event/IEventRepository';
import { ICommentRepository } from '../../domain/comment/ICommentRepository';
import { AuthService } from '../../domain/user/AuthService';
import { IUserEntity } from '../../domain/user/UserEntity';
import { IEventEntity } from '../../domain/event/EventEntity';

/**
 * JUST for demo purposes!
 * as we use in-memory database, we will seed some demo data on the start
 */
@injectable()
export class SeedDatabase {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.AuthService) private auth: AuthService,
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
        @inject(TYPES.EventRepository) private eventRepository: IEventRepository,
        @inject(TYPES.CommentRepository) private commentRepository: ICommentRepository
    ) {
        this.logger.setPrefix('db:seed');
    }

    public async execute() {
        const users = [
            {
                id: 1,
                email: 'user@backend.local',
                password: 'user'
            }
        ];

        const events = [
            {
                id: 1,
                userId: 1,
                title: 'Dog Charity',
                datetime: new Date('2019-11-19 08:29:55')
            },
            {
                id: 2,
                userId: 1,
                title: 'Dog Super Happy Fun Time!!',
                datetime: new Date('2019-11-18 08:29:55')
            },
            {
                id: 3,
                userId: 1,
                title: 'Dog Bowl-A-Thon',
                datetime: new Date('2019-11-18 07:29:55')
            },
            {
                id: 4,
                userId: 1,
                title: 'The Dog Awards',
                datetime: new Date('2019-11-18 08:29:55')
            },
            {
                id: 5,
                userId: 1,
                title: 'The Dog Event of the Year!',
                datetime: new Date('2019-11-18 12:00:00')
            }
        ];

        for (let user of users) {
            this.logger.info(`create user ${user.email}`);
            const record: IUserEntity = { ...user };
            record.password = await this.auth.hashPassword(user.password);
            await this.userRepository.create(record);
        }

        for (let event of events) {
            this.logger.info(`create event ${event.title}`);
            const record: IEventEntity = { ...event };
            await this.eventRepository.create(record);
        }
    }

}