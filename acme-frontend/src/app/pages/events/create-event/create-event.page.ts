import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddEvent } from '../../../actions/event.action';
import { Store } from '@ngxs/store';
import { EventsService } from '../../../shared/services/events/events.service';

@Component({
    selector: 'app-create-event',
    templateUrl: 'create-event.page.html',
    styleUrls: ['create-event.page.scss']
})
export class CreateEventPage implements OnInit {

    eventForm: FormGroup;
    submitted = false;

    constructor(private store: Store, private formBuilder: FormBuilder, private router: Router, private eventService: EventsService) {
        this.eventForm = this.formBuilder.group({
            title: ['', [Validators.required]],
            datetime: ['', [Validators.required]]
        });
    }

    ngOnInit() {

    }

    get f() {
        return this.eventForm.controls;
    }

    handleSubmit() {
        this.submitted = true;

        if (this.eventForm.invalid) {
            return;
        }

        this.eventService.createEvent(this.eventForm.value).subscribe((data) => {
            this.store.dispatch(new AddEvent(data));
            this.router.navigate(['events']);
        });
    }

}
