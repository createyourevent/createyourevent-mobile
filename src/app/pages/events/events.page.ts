import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as dayjs from 'dayjs';
import { GeneralService } from 'src/app/general.service';
import { Event } from '../entities/event/event.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EventsPage implements OnInit {
  events: Event[];
  starEvents: any[] = [];
  loaded = false;

  constructor(private generalService: GeneralService) {}

  ngOnInit() {
    this.generalService.findEventsByPrivateOrPublicAndActiveTrueAndDateEndAfter(dayjs()).subscribe((res) => {
      this.events = res.body;

      this.events.forEach((element) => {
        this.generalService.findReservationsByEventId(element.id).subscribe((r) => {
          element.reservations = r.body;

          this.generalService.getEventStarRatingByEvent(element.id).subscribe((re) => {
            const ratings = re.body;
            let total = 0;
            ratings.forEach((el) => {
              total += el.stars;
            });
            let avg = (total / ratings.length / 10) * 5;
            if (ratings.length === 0) {
              avg = 0;
            }
            this.starEvents.push({ event: element, average: avg, total: ratings.length });
          });
          this.loaded = true;
        });
      });
    });
  }

  getAverage(eventId: number): number {
    if (this.loaded) {
      const se = this.starEvents.find((x) => x.event.id === eventId);
      return se.average;
    }
  }

  getRatingsTotal(eventId: number) {
    if (this.loaded) {
      const se = this.starEvents.find((x) => x.event.id === eventId);
      return se.total;
    }
  }
}
