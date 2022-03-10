import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Gift } from './gift.model';
import { GiftService } from './gift.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-gift-detail',
  templateUrl: 'gift-detail.html',
})
export class GiftDetailPage implements OnInit {
  gift: Gift = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private giftService: GiftService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.gift = response.data;
    });
  }

  open(item: Gift) {
    this.navController.navigateForward('/tabs/entities/gift/' + item.id + '/edit');
  }

  async deleteModal(item: Gift) {
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
            this.giftService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/gift');
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
