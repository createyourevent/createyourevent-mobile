import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { OrganizationLikeDislike } from './organization-like-dislike.model';
import { OrganizationLikeDislikeService } from './organization-like-dislike.service';

@Component({
  selector: 'page-organization-like-dislike',
  templateUrl: 'organization-like-dislike.html',
})
export class OrganizationLikeDislikePage {
  organizationLikeDislikes: OrganizationLikeDislike[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private organizationLikeDislikeService: OrganizationLikeDislikeService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.organizationLikeDislikes = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.organizationLikeDislikeService
      .query()
      .pipe(
        filter((res: HttpResponse<OrganizationLikeDislike[]>) => res.ok),
        map((res: HttpResponse<OrganizationLikeDislike[]>) => res.body)
      )
      .subscribe(
        (response: OrganizationLikeDislike[]) => {
          this.organizationLikeDislikes = response;
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

  trackId(index: number, item: OrganizationLikeDislike) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/organization-like-dislike/new');
  }

  async edit(item: IonItemSliding, organizationLikeDislike: OrganizationLikeDislike) {
    await this.navController.navigateForward('/tabs/entities/organization-like-dislike/' + organizationLikeDislike.id + '/edit');
    await item.close();
  }

  async delete(organizationLikeDislike) {
    this.organizationLikeDislikeService.delete(organizationLikeDislike.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'OrganizationLikeDislike deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(organizationLikeDislike: OrganizationLikeDislike) {
    await this.navController.navigateForward('/tabs/entities/organization-like-dislike/' + organizationLikeDislike.id + '/view');
  }
}
