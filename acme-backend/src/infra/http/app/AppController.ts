import { Controller } from '../Controller';
import { injectable, inject } from 'inversify';
import { ILogger } from '../../../domain/ILogger';
import { App } from '../../App';
import { TYPES } from '../../../config/container';
import { JsonController, Get, InternalServerError, ContentType } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Apidoc } from '../../Apidoc';

interface HealthDto {
    status: string;
}

@injectable()
@JsonController()
export class AppController extends Controller {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(App) private app: App,
        @inject(Apidoc) private apidoc: Apidoc
    ) {
        super();
        this.logger.setPrefix('http:controller:app');
        this.logger.info('constructor');
    }

    @Get('/healthz')
    @OpenAPI({ 'x-admin': true })
    public async healthz(): Promise<HealthDto> {
        if (!this.app.isReady()) {
            throw new InternalServerError('App is not ready!');
        }

        return { status: 'ok' };
    }

    @Get('/metrics')
    @OpenAPI({ 'x-admin': true })
    public async metrics(): Promise<any> {
        this.logger.info('@todo: metrics');
        return {};
    }

    @Get('/apidoc/developer')
    @ContentType('text/html')
    @OpenAPI({ 'x-admin': true })
    public async apidocDeveloper(): Promise<any> {
        return this.apidoc.getDocContent('developerspec.json');
    }

    @Get('/apidoc/developerspec.json')
    @OpenAPI({ 'x-admin': true })
    public async developerspec(): Promise<any> {
        return this.apidoc.getFullSpec();
    }

}