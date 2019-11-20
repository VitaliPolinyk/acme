import { Container, injectable, inject } from 'inversify';
import * as _ from 'lodash';
import { LEVEL, MESSAGE, SPLAT } from 'triple-beam';
import util = require('util');
import { createLogger, format, info, transports, Logger as WinstonLogger } from 'winston';
import { ILogger } from '../domain/ILogger';
import { RequestState } from './http/RequestState';

@injectable()
export class Logger implements ILogger {
    protected prefix: string = '';
    protected logger: WinstonLogger;

    constructor(
        @inject(RequestState) private requestState: RequestState
    ) {
        this.logger = createLogger({
            level: process.env.LOG_LEVEL || 'info',
            silent: process.env.NODE_ENV === 'test',
            format: format.combine(
                format.timestamp(),
                format.printf((info) => {
                    let requestIdString = '';

                    if (typeof this.requestState.requestId !== 'undefined') {
                        requestIdString = ` [${this.requestState.requestId}]`;
                    }

                    let extra = [];
                    if (!_.isUndefined(info[SPLAT])) {
                        extra = _.map(info[SPLAT], (item) => {
                            return _.isObject(item) ? util.format('%O', item) : item;
                        });
                    }

                    return `${info.timestamp} ${info[LEVEL]}${requestIdString} ${info.message} ${extra.join(', ')}`;
                }),

            ),
            transports: [
                new transports.Console()
            ]
        });
    }

    public setPrefix(prefix: string) {
        this.prefix = prefix;
    }

    private getPrefix() {
        return this.prefix ? `[${this.prefix}]` : '';
    }

    public info(...args) {
        this.logger.info(this.getPrefix(), ...args);
    }

    public verbose(...args) {
        this.logger.verbose(this.getPrefix(), ...args);
    }

    public debug(...args) {
        this.logger.debug(this.getPrefix(), ...args);
    }

    public warn(...args) {
        this.logger.warn(this.getPrefix(), ...args);
    }

    public error(...args) {
        this.logger.error(this.getPrefix(), ...args);
    }
}