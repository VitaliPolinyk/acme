// import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';
// import { injectable, inject } from 'inversify';
// import { ILogger } from '../../domain/ILogger';
// import { TYPES } from '../../config/container';

// @injectable()
// @Interceptor()
// export class RequestInterceptor implements InterceptorInterface {
//     @inject(TYPES.Logger) private logger: ILogger;

//     intercept(action: Action, content: any) {
//         // console.info('request interceptor: ', JSON.stringify(action, null, 2));
//         // console.info('request interceptor: ', JSON.stringify(content, null, 2));
//         // this.logger.info(`<- ${action.request.method} ${action.request.url}`);

//         return content;
//     }

// }