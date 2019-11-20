import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AddEvent } from '../actions/event.action';
import { Event } from '../models/Event';

export class EventStateModel {
    events: Event [];
}

@State<EventStateModel>({
    name: 'events',
    defaults: {
        events: []
    }
})

export class EventState {

    @Selector()
    static getEvents(state: EventStateModel) {
        return state.events;
    }

    @Action(AddEvent)
    addEvent({getState, patchState}: StateContext<EventStateModel>, {payload}: AddEvent) {
        const state = getState();
        patchState({
            events: [...state.events, payload]
        });
    }
}
