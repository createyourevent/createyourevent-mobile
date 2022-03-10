import { Component, OnInit } from '@angular/core';
import { SlotListCherry } from './slot-list-cherry.model';
import { SlotListCherryService } from './slot-list-cherry.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-slot-list-cherry-detail',
  templateUrl: 'slot-list-cherry-detail.html',
})
export class SlotListCherryDetailPage implements OnInit {
  slotListCherry: SlotListCherry = {};

  constructor(
    private navController: NavController,
    private slotListCherryService: SlotListCherryService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.slotListCherry = response.data;
    });
  }

  open(item: SlotListCherry) {
    this.navController.navigateForward('/tabs/entities/slot-list-cherry/' + item.id + '/edit');
  }

  async deleteModal(item: SlotListCherry) {
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
            this.slotListCherryService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/slot-list-cherry');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
