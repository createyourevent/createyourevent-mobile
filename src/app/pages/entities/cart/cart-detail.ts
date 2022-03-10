import { Component, OnInit } from '@angular/core';
import { Cart } from './cart.model';
import { CartService } from './cart.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-cart-detail',
  templateUrl: 'cart-detail.html',
})
export class CartDetailPage implements OnInit {
  cart: Cart = {};

  constructor(
    private navController: NavController,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.cart = response.data;
    });
  }

  open(item: Cart) {
    this.navController.navigateForward('/tabs/entities/cart/' + item.id + '/edit');
  }

  async deleteModal(item: Cart) {
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
            this.cartService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/cart');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
