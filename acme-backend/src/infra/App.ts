import { injectable, inject } from 'inversify';
import * as gracefulShutdown from 'http-graceful-shutdown';
import { ILogger } from '../domain/ILogger';
import { TYPES } from '../config/container';

@injectable()
export class App {
    private ready: boolean = false;
    constructor(
        @inject(TYPES.Logger) private logger: ILogger
    ) {
        this.logger.setPrefix('app');
        this.logger.info('constructor');
    }

    public setGracefulShutdown(webserver) {
        // this enables the graceful shutdown with advanced options
        gracefulShutdown(webserver, {
            signals: 'SIGINT SIGTERM',
            timeout: 10000,
            development: false,
            onShutdown: async () => await this.stop(),
            finally: () => {
                this.logger.info('gracefully shut down...');
            }
        });
    }

    public isReady(): boolean {
        return this.ready;
    }

    public async start() {
        this.logger.info(`starting with pid: ${process.pid}`);

        this.ready = true;
        this.logger.info('is ready');
    }

    async stop() {
        this.logger.info('cleanup is finished');
        this.ready = false;
    }
}