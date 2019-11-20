import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Event } from '../../models/Event';
import { EventsService } from '../../shared/services/events/events.service';
import { SetEvents } from '../../actions/event.action';

@Component({
    selector: 'app-events',
    templateUrl: 'events.page.html',
    styleUrls: ['events.page.scss']
})
export class EventsPage implements OnInit, OnDestroy {

    subscription: Subscription;

    events: Observable<Event[]>;

    event = {
        title: '',
        desc: '',
        startTime: '',
        endTime: '',
        allDay: false
    };

    minDate = new Date().toISOString();

    eventSource = [];
    viewTitle;

    calendar = {
        mode: 'month',
        currentDate: new Date(),
    };

    constructor(private eventService: EventsService, private store: Store) {
        this.events = this.store.select(state => state.events.events);
    }

    ngOnInit() {
        this.resetEvent();
        this.getAllEvents();
        this.subscription = this.events.subscribe((data) => {
            if (data) {
                this.eventSource = data;
            }
        });
    }

    getAllEvents() {
        this.eventService.getAllEvents().subscribe((data) => {
            this.store.dispatch(new SetEvents(data));
        });
    }

    resetEvent() {
        this.event = {
            title: '',
            desc: '',
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            allDay: false
        };
    }

    changeMode(mode) {
        this.calendar.mode = mode;
    }

// Focus today
    today() {
        this.calendar.currentDate = new Date();
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }


// Time slot was clicked
    onTimeSelected(ev) {
        const selected = new Date(ev.selectedTime);
        this.event.startTime = selected.toISOString();
        selected.setHours(selected.getHours() + 1);
        this.event.endTime = (selected.toISOString());
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
