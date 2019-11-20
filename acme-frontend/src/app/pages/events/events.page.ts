import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { EventState } from '../../state/event.state';
import { Event } from '../../models/Event';
import { EventsService } from '../../shared/services/events/events.service';
import { SetEvents } from '../../actions/event.action';

@Component({
    selector: 'app-events',
    templateUrl: 'events.page.html',
    styleUrls: ['events.page.scss']
})
export class EventsPage implements OnInit {

    @Select(EventState.getEvents) events: Observable<Event[]>;
    selectedDay = new Date();
    selectedObject;
    viewTitle;
    isToday: boolean;
    calendarModes = [
        {key: 'month', value: 'Month'},
        {key: 'week', value: 'Week'},
        {key: 'day', value: 'Day'},
    ];
    calendar = {
        mode: this.calendarModes[0].key,
        currentDate: new Date()
    };

    constructor(private eventService: EventsService, private store: Store) {}

    ngOnInit() {
        this.getAllEvents();
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    onEventSelected(event) {
        console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
    }

    onTimeSelected(ev) {
        this.selectedObject = ev;
    }

    onCurrentDateChanged(event: Date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);
        this.isToday = today.getTime() === event.getTime();

        this.selectedDay = event;

    }

    getAllEvents() {
        this.eventService.getAllEvents().subscribe((data) => {
            if (data) {
                this.store.dispatch(new SetEvents(data));
            }
        });
    }

    markDisabled(date: Date) {
        const current = new Date();
        current.setHours(0, 0, 0);
        return (date < current);
    }

    onOptionSelected($event: any) {
        this.calendar.mode = $event;
    }
}
