import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { PointsExchange } from './points-exchange.model';
import { PointsExchangeService } from './points-exchange.service';

@Component({
  selector: 'page-points-exchange',
  templateUrl: 'points-exchange.html',
})
export class PointsExchangePage {
  pointsExchanges: PointsExchange[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private pointsExchangeService: PointsExchangeService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.pointsExchanges = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.pointsExchangeService
      .query()
      .pipe(
        filter((res: HttpResponse<PointsExchange[]>) => res.ok),
        map((res: HttpResponse<PointsExchange[]>) => res.body)
      )
      .subscribe(
        (response: PointsExchange[]) => {
          this.pointsExchanges = response;
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

  trackId(index: number, item: PointsExchange) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/points-exchange/new');
  }

  async edit(item: IonItemSliding, pointsExchange: PointsExchange) {
    await this.navController.navigateForward('/tabs/entities/points-exchange/' + pointsExchange.id + '/edit');
    await item.close();
  }

  async delete(pointsExchange) {
    this.pointsExchangeService.delete(pointsExchange.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'PointsExchange deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(pointsExchange: PointsExchange) {
    await this.navController.navigateForward('/tabs/entities/points-exchange/' + pointsExchange.id + '/view');
  }
}
