import { Component, OnInit } from '@angular/core';
import { SlotListClock } from './slot-list-clock.model';
import { SlotListClockService } from './slot-list-clock.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-slot-list-clock-detail',
  templateUrl: 'slot-list-clock-detail.html',
})
export class SlotListClockDetailPage implements OnInit {
  slotListClock: SlotListClock = {};

  constructor(
    private navController: NavController,
    private slotListClockService: SlotListClockService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.slotListClock = response.data;
    });
  }

  open(item: SlotListClock) {
    this.navController.navigateForward('/tabs/entities/slot-list-clock/' + item.id + '/edit');
  }

  async deleteModal(item: SlotListClock) {
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
            this.slotListClockService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/slot-list-clock');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
