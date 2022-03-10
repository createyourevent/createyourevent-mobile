import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ServiceLikeDislike } from './service-like-dislike.model';
import { ServiceLikeDislikeService } from './service-like-dislike.service';

@Component({
  selector: 'page-service-like-dislike',
  templateUrl: 'service-like-dislike.html',
})
export class ServiceLikeDislikePage {
  serviceLikeDislikes: ServiceLikeDislike[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private serviceLikeDislikeService: ServiceLikeDislikeService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.serviceLikeDislikes = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.serviceLikeDislikeService
      .query()
      .pipe(
        filter((res: HttpResponse<ServiceLikeDislike[]>) => res.ok),
        map((res: HttpResponse<ServiceLikeDislike[]>) => res.body)
      )
      .subscribe(
        (response: ServiceLikeDislike[]) => {
          this.serviceLikeDislikes = response;
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

  trackId(index: number, item: ServiceLikeDislike) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/service-like-dislike/new');
  }

  async edit(item: IonItemSliding, serviceLikeDislike: ServiceLikeDislike) {
    await this.navController.navigateForward('/tabs/entities/service-like-dislike/' + serviceLikeDislike.id + '/edit');
    await item.close();
  }

  async delete(serviceLikeDislike) {
    this.serviceLikeDislikeService.delete(serviceLikeDislike.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'ServiceLikeDislike deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(serviceLikeDislike: ServiceLikeDislike) {
    await this.navController.navigateForward('/tabs/entities/service-like-dislike/' + serviceLikeDislike.id + '/view');
  }
}
