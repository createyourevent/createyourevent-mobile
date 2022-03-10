import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Location } from './location.model';
import { LocationService } from './location.service';

@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {
  locations: Location[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private locationService: LocationService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.locations = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.locationService
      .query()
      .pipe(
        filter((res: HttpResponse<Location[]>) => res.ok),
        map((res: HttpResponse<Location[]>) => res.body)
      )
      .subscribe(
        (response: Location[]) => {
          this.locations = response;
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

  trackId(index: number, item: Location) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/location/new');
  }

  async edit(item: IonItemSliding, location: Location) {
    await this.navController.navigateForward('/tabs/entities/location/' + location.id + '/edit');
    await item.close();
  }

  async delete(location) {
    this.locationService.delete(location.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Location deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(location: Location) {
    await this.navController.navigateForward('/tabs/entities/location/' + location.id + '/view');
  }
}
