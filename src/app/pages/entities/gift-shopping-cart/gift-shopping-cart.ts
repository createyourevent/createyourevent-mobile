import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { GiftShoppingCart } from './gift-shopping-cart.model';
import { GiftShoppingCartService } from './gift-shopping-cart.service';

@Component({
  selector: 'page-gift-shopping-cart',
  templateUrl: 'gift-shopping-cart.html',
})
export class GiftShoppingCartPage {
  giftShoppingCarts: GiftShoppingCart[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private giftShoppingCartService: GiftShoppingCartService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.giftShoppingCarts = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.giftShoppingCartService
      .query()
      .pipe(
        filter((res: HttpResponse<GiftShoppingCart[]>) => res.ok),
        map((res: HttpResponse<GiftShoppingCart[]>) => res.body)
      )
      .subscribe(
        (response: GiftShoppingCart[]) => {
          this.giftShoppingCarts = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          await toast.present();
        }
      );
  }

  trackId(index: number, item: GiftShoppingCart) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/gift-shopping-cart/new');
  }

  async edit(item: IonItemSliding, giftShoppingCart: GiftShoppingCart) {
    await this.navController.navigateForward('/tabs/entities/gift-shopping-cart/' + giftShoppingCart.id + '/edit');
    await item.close();
  }

  async delete(giftShoppingCart) {
    this.giftShoppingCartService.delete(giftShoppingCart.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'GiftShoppingCart deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(giftShoppingCart: GiftShoppingCart) {
    await this.navController.navigateForward('/tabs/entities/gift-shopping-cart/' + giftShoppingCart.id + '/view');
  }
}
