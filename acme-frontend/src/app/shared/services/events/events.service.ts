import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api';
import { map } from 'rxjs/operators';

@Injectable()
export class EventsService {
    constructor(private router: Router, private api: ApiService) {
    }

    getAllEvents() {
        return this.api.get('event').pipe(map(events => {
           return  events.map((event) => {
               return  this.filterEvents(event);
            });
        }));
    }

    createEvent(params) {
        return this.api.post('event', params).pipe((map((event) => {
           return this.filterEvents(event);
        })));
    }

    filterEvents(event) {
            return {
                title: event.title,
                desc: '',
                startTime: new Date(event.datetime),
                endTime: new Date(event.datetime),
                allDay: false
            };
    }

}
