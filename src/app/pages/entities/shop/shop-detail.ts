import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Shop } from './shop.model';
import { ShopService } from './shop.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-shop-detail',
  templateUrl: 'shop-detail.html',
})
export class ShopDetailPage implements OnInit {
  shop: Shop = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.shop = response.data;
    });
  }

  open(item: Shop) {
    this.navController.navigateForward('/tabs/entities/shop/' + item.id + '/edit');
  }

  async deleteModal(item: Shop) {
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
            this.shopService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/shop');
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
