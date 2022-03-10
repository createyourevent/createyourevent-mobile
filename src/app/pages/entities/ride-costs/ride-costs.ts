import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { RideCosts } from './ride-costs.model';
import { RideCostsService } from './ride-costs.service';

@Component({
  selector: 'page-ride-costs',
  templateUrl: 'ride-costs.html',
})
export class RideCostsPage {
  rideCosts: RideCosts[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private rideCostsService: RideCostsService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.rideCosts = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.rideCostsService
      .query()
      .pipe(
        filter((res: HttpResponse<RideCosts[]>) => res.ok),
        map((res: HttpResponse<RideCosts[]>) => res.body)
      )
      .subscribe(
        (response: RideCosts[]) => {
          this.rideCosts = response;
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

  trackId(index: number, item: RideCosts) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/ride-costs/new');
  }

  async edit(item: IonItemSliding, rideCosts: RideCosts) {
    await this.navController.navigateForward('/tabs/entities/ride-costs/' + rideCosts.id + '/edit');
    await item.close();
  }

  async delete(rideCosts) {
    this.rideCostsService.delete(rideCosts.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'RideCosts deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(rideCosts: RideCosts) {
    await this.navController.navigateForward('/tabs/entities/ride-costs/' + rideCosts.id + '/view');
  }
}
