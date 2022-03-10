import { Component, OnInit } from '@angular/core';
import { GiftShoppingCart } from './gift-shopping-cart.model';
import { GiftShoppingCartService } from './gift-shopping-cart.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-gift-shopping-cart-detail',
  templateUrl: 'gift-shopping-cart-detail.html',
})
export class GiftShoppingCartDetailPage implements OnInit {
  giftShoppingCart: GiftShoppingCart = {};

  constructor(
    private navController: NavController,
    private giftShoppingCartService: GiftShoppingCartService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.giftShoppingCart = response.data;
    });
  }

  open(item: GiftShoppingCart) {
    this.navController.navigateForward('/tabs/entities/gift-shopping-cart/' + item.id + '/edit');
  }

  async deleteModal(item: GiftShoppingCart) {
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
            this.giftShoppingCartService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/gift-shopping-cart');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
