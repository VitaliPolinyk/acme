import * as _ from 'lodash';
import * as perfy from 'perfy';
import * as uuidv1 from 'uuid';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../../domain/ILogger';
import { TYPES } from '../../../config/container';

import { Middleware, KoaMiddlewareInterface } from 'routing-controllers';
import { RequestState } from '../RequestState';

@injectable()
@Middleware({ type: 'before' })
export class RequestMiddleware implements KoaMiddlewareInterface {
    @inject(TYPES.Logger) private logger: ILogger;
    @inject(RequestState) private state: RequestState;
    private ignore = ['/ping'];

    private logRequest(ctx, str) {
        if (!_.includes(this.ignore, ctx.originalUrl)) {
            this.logger.info(str);
        }
    }

    async use(ctx: any, next: (err: any) => Promise<any>): Promise<any> {
        const requestUuid = uuidv1();
        this.state.requestId = requestUuid;
        perfy.start(`request-${requestUuid}`);

        this.logRequest(ctx, `← ${ctx.method} ${ctx.originalUrl}`);

        try {
            await next(ctx);

            const time = perfy.exists(`request-${requestUuid}`) ? perfy.end(`request-${requestUuid}`).fullMilliseconds : 0;

            this.logRequest(ctx, `→ ${ctx.method} ${ctx.originalUrl} ${ctx.status || 404} ${time}ms`);

        } catch (err) {
            const time = perfy.exists(`request-${requestUuid}`) ? perfy.end(`request-${requestUuid}`).time : 0;

            this.logger.info(`→ ${ctx.method} ${ctx.originalUrl} ${ctx.status} ${err.developerMessage || err.message} ${time}ms`);
        }
    }

}