import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ProductComment } from './product-comment.model';
import { ProductCommentService } from './product-comment.service';

@Component({
  selector: 'page-product-comment',
  templateUrl: 'product-comment.html',
})
export class ProductCommentPage {
  productComments: ProductComment[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private productCommentService: ProductCommentService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.productComments = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.productCommentService
      .query()
      .pipe(
        filter((res: HttpResponse<ProductComment[]>) => res.ok),
        map((res: HttpResponse<ProductComment[]>) => res.body)
      )
      .subscribe(
        (response: ProductComment[]) => {
          this.productComments = response;
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

  trackId(index: number, item: ProductComment) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/product-comment/new');
  }

  async edit(item: IonItemSliding, productComment: ProductComment) {
    await this.navController.navigateForward('/tabs/entities/product-comment/' + productComment.id + '/edit');
    await item.close();
  }

  async delete(productComment) {
    this.productCommentService.delete(productComment.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ProductComment deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(productComment: ProductComment) {
    await this.navController.navigateForward('/tabs/entities/product-comment/' + productComment.id + '/view');
  }
}
