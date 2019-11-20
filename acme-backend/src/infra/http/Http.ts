import { injectable, inject } from 'inversify';
import * as Koa from 'koa';
import * as serve from 'koa-static';
import * as perfy from 'perfy';
import config from '../../config';
import { ILogger } from '../../domain/ILogger';
import { RequestMiddleware } from './middlewares/RequestMiddleware';
import { TYPES, container } from '../../config/container';
import { useContainer, Action, useKoaServer } from 'routing-controllers';
import { AppController } from './app/AppController';
import { UserController } from './user/UserController';
import { UserAuthenticateUseCase } from '../../domain/user/UserAuthenticateUseCase';
import { EventController } from './event/EventController';
import { IUserEntity } from '../../domain/user/UserEntity';
import { CommentController } from './comment/CommentController';

@injectable()
export class Http {
    private ready: boolean = false;
    public koa: Koa<Koa.DefaultState, Koa.DefaultContext>;
    public server: import('http').Server;

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(RequestMiddleware) private requestMiddleware: RequestMiddleware
    ) {
        this.logger = logger;
        this.logger.setPrefix('http');
        this.logger.info('constructor');
    }

    public isReady(): boolean {
        return this.ready;
    }

    public async start() {
        perfy.start('server');
        return new Promise((resolve, reject) => {
            useContainer(container);

            const koa = new Koa();
            this.koa = koa;

            useKoaServer(koa, {
                cors: {
                    origin: '*',
                    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
                    headers: 'content-type, authorization'
                },
                controllers: [
                    AppController,
                    UserController,
                    EventController,
                    CommentController,
                ],
                middlewares: [
                    RequestMiddleware
                ],
                interceptors: [],
                authorizationChecker: async (action: Action, roles: string[] = null) => {
                    const tokenStr = action.request.headers['authorization'];
                    const tokenArr = tokenStr ? tokenStr.split(' ') :[];

                    if (tokenArr.length !== 2) {
                        return false;
                    }

                    const token: string = tokenArr[1];
                    const useCase = container.get<UserAuthenticateUseCase>(UserAuthenticateUseCase);
                    const user = await useCase.execute(token);

                    if (user) {
                        action.context.state.user = {...user} as IUserEntity;
                        return true;
                    }

                    return false;
                }
            });

            this.koa.use(serve(__dirname + '/public'));

            this.server = this.koa.listen(config.port, () => {
                const time = perfy.exists('server') ? perfy.end('server').fullMilliseconds :-1;
                this.logger.info(`started at port: ${config.port} ${time} ms`);
                this.ready = true;
                return resolve();
            });

            this.koa.on('error', (err, ctx) => {
                this.logger.error('error', err, ctx);
                this.ready = false;
            });
        });

    }

    async stop() {
        this.logger.info('cleanup is finished');
        this.ready = false;
    }
}
