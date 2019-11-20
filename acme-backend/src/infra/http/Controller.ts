import { injectable } from 'inversify';
import * as autoBind from 'auto-bind';

@injectable()
export class Controller {
    constructor() {
        // @ts-ignore
        autoBind(this);
    }
}