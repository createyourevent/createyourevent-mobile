import { Injectable } from '@angular/core';
import { Event } from './pages/entities/event';

@Injectable({
  providedIn: 'root',
})
export class SharedEventService {
  public selectedEvent: Event;

  constructor() {}
}
