import { Component, OnInit } from '@angular/core';
import { SlotListOrange } from './slot-list-orange.model';
import { SlotListOrangeService } from './slot-list-orange.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-slot-list-orange-detail',
  templateUrl: 'slot-list-orange-detail.html',
})
export class SlotListOrangeDetailPage implements OnInit {
  slotListOrange: SlotListOrange = {};

  constructor(
    private navController: NavController,
    private slotListOrangeService: SlotListOrangeService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.slotListOrange = response.data;
    });
  }

  open(item: SlotListOrange) {
    this.navController.navigateForward('/tabs/entities/slot-list-orange/' + item.id + '/edit');
  }

  async deleteModal(item: SlotListOrange) {
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
            this.slotListOrangeService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/slot-list-orange');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
