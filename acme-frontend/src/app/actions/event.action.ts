import { Event } from '../models/Event';

export class SetEvents {
    static readonly type = '[Event] SetEvents';

    constructor(public payload: Event[]) {}
}

export class AddEvent {
    static readonly type = '[Project] AddEvent';

    constructor(public payload: Event) {}
}
