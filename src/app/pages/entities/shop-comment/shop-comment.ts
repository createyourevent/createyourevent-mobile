import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ShopComment } from './shop-comment.model';
import { ShopCommentService } from './shop-comment.service';

@Component({
  selector: 'page-shop-comment',
  templateUrl: 'shop-comment.html',
})
export class ShopCommentPage {
  shopComments: ShopComment[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private shopCommentService: ShopCommentService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.shopComments = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.shopCommentService
      .query()
      .pipe(
        filter((res: HttpResponse<ShopComment[]>) => res.ok),
        map((res: HttpResponse<ShopComment[]>) => res.body)
      )
      .subscribe(
        (response: ShopComment[]) => {
          this.shopComments = response;
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

  trackId(index: number, item: ShopComment) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/shop-comment/new');
  }

  async edit(item: IonItemSliding, shopComment: ShopComment) {
    await this.navController.navigateForward('/tabs/entities/shop-comment/' + shopComment.id + '/edit');
    await item.close();
  }

  async delete(shopComment) {
    this.shopCommentService.delete(shopComment.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ShopComment deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(shopComment: ShopComment) {
    await this.navController.navigateForward('/tabs/entities/shop-comment/' + shopComment.id + '/view');
  }
}
