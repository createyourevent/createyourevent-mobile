import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ServiceComment } from './service-comment.model';
import { ServiceCommentService } from './service-comment.service';

@Component({
  selector: 'page-service-comment',
  templateUrl: 'service-comment.html',
})
export class ServiceCommentPage {
  serviceComments: ServiceComment[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private serviceCommentService: ServiceCommentService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.serviceComments = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.serviceCommentService
      .query()
      .pipe(
        filter((res: HttpResponse<ServiceComment[]>) => res.ok),
        map((res: HttpResponse<ServiceComment[]>) => res.body)
      )
      .subscribe(
        (response: ServiceComment[]) => {
          this.serviceComments = response;
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

  trackId(index: number, item: ServiceComment) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/service-comment/new');
  }

  async edit(item: IonItemSliding, serviceComment: ServiceComment) {
    await this.navController.navigateForward('/tabs/entities/service-comment/' + serviceComment.id + '/edit');
    await item.close();
  }

  async delete(serviceComment) {
    this.serviceCommentService.delete(serviceComment.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ServiceComment deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(serviceComment: ServiceComment) {
    await this.navController.navigateForward('/tabs/entities/service-comment/' + serviceComment.id + '/view');
  }
}
