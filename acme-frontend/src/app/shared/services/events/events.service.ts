import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api';

@Injectable()
export class EventsService {
    constructor(private router: Router, private api: ApiService) {
    }

    getAllEvents() {
        return this.api.get('event');
    }

    createEvent(params) {
        return this.api.post('event', params);
    }

}
