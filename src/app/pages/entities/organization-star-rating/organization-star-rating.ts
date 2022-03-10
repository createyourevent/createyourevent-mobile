import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { OrganizationStarRating } from './organization-star-rating.model';
import { OrganizationStarRatingService } from './organization-star-rating.service';

@Component({
  selector: 'page-organization-star-rating',
  templateUrl: 'organization-star-rating.html',
})
export class OrganizationStarRatingPage {
  organizationStarRatings: OrganizationStarRating[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private organizationStarRatingService: OrganizationStarRatingService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.organizationStarRatings = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.organizationStarRatingService
      .query()
      .pipe(
        filter((res: HttpResponse<OrganizationStarRating[]>) => res.ok),
        map((res: HttpResponse<OrganizationStarRating[]>) => res.body)
      )
      .subscribe(
        (response: OrganizationStarRating[]) => {
          this.organizationStarRatings = response;
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

  trackId(index: number, item: OrganizationStarRating) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/organization-star-rating/new');
  }

  async edit(item: IonItemSliding, organizationStarRating: OrganizationStarRating) {
    await this.navController.navigateForward('/tabs/entities/organization-star-rating/' + organizationStarRating.id + '/edit');
    await item.close();
  }

  async delete(organizationStarRating) {
    this.organizationStarRatingService.delete(organizationStarRating.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'OrganizationStarRating deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(organizationStarRating: OrganizationStarRating) {
    await this.navController.navigateForward('/tabs/entities/organization-star-rating/' + organizationStarRating.id + '/view');
  }
}
