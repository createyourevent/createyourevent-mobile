import { Component, OnInit } from '@angular/core';
import { SlotListPlum } from './slot-list-plum.model';
import { SlotListPlumService } from './slot-list-plum.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-slot-list-plum-detail',
  templateUrl: 'slot-list-plum-detail.html',
})
export class SlotListPlumDetailPage implements OnInit {
  slotListPlum: SlotListPlum = {};

  constructor(
    private navController: NavController,
    private slotListPlumService: SlotListPlumService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.slotListPlum = response.data;
    });
  }

  open(item: SlotListPlum) {
    this.navController.navigateForward('/tabs/entities/slot-list-plum/' + item.id + '/edit');
  }

  async deleteModal(item: SlotListPlum) {
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
            this.slotListPlumService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/slot-list-plum');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
