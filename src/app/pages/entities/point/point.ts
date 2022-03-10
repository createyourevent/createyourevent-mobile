import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Point } from './point.model';
import { PointService } from './point.service';

@Component({
  selector: 'page-point',
  templateUrl: 'point.html',
})
export class PointPage {
  points: Point[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private pointService: PointService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.points = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.pointService
      .query()
      .pipe(
        filter((res: HttpResponse<Point[]>) => res.ok),
        map((res: HttpResponse<Point[]>) => res.body)
      )
      .subscribe(
        (response: Point[]) => {
          this.points = response;
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

  trackId(index: number, item: Point) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/point/new');
  }

  async edit(item: IonItemSliding, point: Point) {
    await this.navController.navigateForward('/tabs/entities/point/' + point.id + '/edit');
    await item.close();
  }

  async delete(point) {
    this.pointService.delete(point.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Point deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(point: Point) {
    await this.navController.navigateForward('/tabs/entities/point/' + point.id + '/view');
  }
}
