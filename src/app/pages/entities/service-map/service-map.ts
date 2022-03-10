import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ServiceMap } from './service-map.model';
import { ServiceMapService } from './service-map.service';

@Component({
  selector: 'page-service-map',
  templateUrl: 'service-map.html',
})
export class ServiceMapPage {
  serviceMaps: ServiceMap[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private serviceMapService: ServiceMapService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.serviceMaps = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.serviceMapService
      .query()
      .pipe(
        filter((res: HttpResponse<ServiceMap[]>) => res.ok),
        map((res: HttpResponse<ServiceMap[]>) => res.body)
      )
      .subscribe(
        (response: ServiceMap[]) => {
          this.serviceMaps = response;
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

  trackId(index: number, item: ServiceMap) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/service-map/new');
  }

  async edit(item: IonItemSliding, serviceMap: ServiceMap) {
    await this.navController.navigateForward('/tabs/entities/service-map/' + serviceMap.id + '/edit');
    await item.close();
  }

  async delete(serviceMap) {
    this.serviceMapService.delete(serviceMap.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ServiceMap deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(serviceMap: ServiceMap) {
    await this.navController.navigateForward('/tabs/entities/service-map/' + serviceMap.id + '/view');
  }
}
