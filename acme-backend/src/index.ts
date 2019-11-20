import 'reflect-metadata';
import { container, TYPES } from './config/container';
import * as perfy from 'perfy';
import { App } from './infra/App';
import { Logger } from './infra/Logger';
import { Http } from './infra/http/Http';
import { RequestState } from './infra/http/RequestState';
import { RequestMiddleware } from './infra/http/middlewares/RequestMiddleware';
import { ILogger } from './domain/ILogger';
import { IEventRepository } from './domain/event/IEventRepository';
import { IUserRepository } from './domain/user/IUserRepository';
import { ICommentRepository } from './domain/comment/ICommentRepository';
import { EventInmemoryRepository } from './infra/database/EventInmemoryRepository';
import { UserInmemoryRepository } from './infra/database/UserInmemoryRepository';
import { CommentInmemoryRepository } from './infra/database/CommentInmemoryRepository';
import { SeedDatabase } from './infra/database/SeedDatabase';
import { AuthService } from './domain/user/AuthService';

// configure DI
container.bind<Http>(Http).toSelf().inSingletonScope();
container.bind<ILogger>(TYPES.Logger).to(Logger).inRequestScope();

container.bind<App>(App).toSelf().inSingletonScope();
container.bind<IUserRepository>(TYPES.UserRepository).to(UserInmemoryRepository).inSingletonScope();
container.bind<IEventRepository>(TYPES.EventRepository).to(EventInmemoryRepository).inSingletonScope();
container.bind<ICommentRepository>(TYPES.CommentRepository).to(CommentInmemoryRepository).inSingletonScope();
container.bind<AuthService>(TYPES.AuthService).to(AuthService).inRequestScope();
container.bind<RequestState>(RequestState).toSelf().inRequestScope();
container.bind<RequestMiddleware>(RequestMiddleware).toSelf().inRequestScope();
container.bind<SeedDatabase>(SeedDatabase).toSelf().inSingletonScope();

(async () => {
    perfy.start('core');
    const logger = container.get<ILogger>(TYPES.Logger);
    logger.setPrefix('core');

    const app = container.get<App>(App);
    const http = container.get<Http>(Http);

    const seed = container.get<SeedDatabase>(SeedDatabase);
    await seed.execute();

    try {
        await http.start();
        await app.start();

        app.setGracefulShutdown(http.server);
        const time = perfy.exists('core') ? perfy.end('core').fullMilliseconds : -1;
        logger.info(`everything is ready ${time} ms`);
    } catch (err) {
        logger.error('catch error: ', err.stack);
    }
})();

