import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Cart } from './cart.model';
import { CartService } from './cart.service';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  carts: Cart[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private cartService: CartService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.carts = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.cartService
      .query()
      .pipe(
        filter((res: HttpResponse<Cart[]>) => res.ok),
        map((res: HttpResponse<Cart[]>) => res.body)
      )
      .subscribe(
        (response: Cart[]) => {
          this.carts = response;
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

  trackId(index: number, item: Cart) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/cart/new');
  }

  async edit(item: IonItemSliding, cart: Cart) {
    await this.navController.navigateForward('/tabs/entities/cart/' + cart.id + '/edit');
    await item.close();
  }

  async delete(cart) {
    this.cartService.delete(cart.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Cart deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(cart: Cart) {
    await this.navController.navigateForward('/tabs/entities/cart/' + cart.id + '/view');
  }
}
