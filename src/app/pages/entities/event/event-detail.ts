import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Event } from './event.model';
import { EventService } from './event.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage implements OnInit {
  event: Event = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.event = response.data;
    });
  }

  open(item: Event) {
    this.navController.navigateForward('/tabs/entities/event/' + item.id + '/edit');
  }

  async deleteModal(item: Event) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.eventService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/event');
            });
          },
        },
      ],
    });
    await alert.present();
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
}
