import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EventsPage } from './events.page';
import { CreateEventPage } from './create-event/create-event.page';
import { NgCalendarModule  } from 'ionic2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NgCalendarModule,
    RouterModule.forChild([
      {
        path: '',
        component: EventsPage,
      },
      {
        path: 'create-event',
        component: CreateEventPage
      }
    ])
  ],
  declarations: [EventsPage, CreateEventPage]
})
export class EventsPageModule {}
