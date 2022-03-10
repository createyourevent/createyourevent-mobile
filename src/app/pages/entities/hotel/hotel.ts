import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Hotel } from './hotel.model';
import { HotelService } from './hotel.service';

@Component({
  selector: 'page-hotel',
  templateUrl: 'hotel.html',
})
export class HotelPage {
  hotels: Hotel[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private hotelService: HotelService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.hotels = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.hotelService
      .query()
      .pipe(
        filter((res: HttpResponse<Hotel[]>) => res.ok),
        map((res: HttpResponse<Hotel[]>) => res.body)
      )
      .subscribe(
        (response: Hotel[]) => {
          this.hotels = response;
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

  trackId(index: number, item: Hotel) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/hotel/new');
  }

  async edit(item: IonItemSliding, hotel: Hotel) {
    await this.navController.navigateForward('/tabs/entities/hotel/' + hotel.id + '/edit');
    await item.close();
  }

  async delete(hotel) {
    this.hotelService.delete(hotel.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Hotel deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(hotel: Hotel) {
    await this.navController.navigateForward('/tabs/entities/hotel/' + hotel.id + '/view');
  }
}
