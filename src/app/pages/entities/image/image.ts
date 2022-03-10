import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Image } from './image.model';
import { ImageService } from './image.service';

@Component({
  selector: 'page-image',
  templateUrl: 'image.html',
})
export class ImagePage {
  images: Image[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private imageService: ImageService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.images = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.imageService
      .query()
      .pipe(
        filter((res: HttpResponse<Image[]>) => res.ok),
        map((res: HttpResponse<Image[]>) => res.body)
      )
      .subscribe(
        (response: Image[]) => {
          this.images = response;
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

  trackId(index: number, item: Image) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/image/new');
  }

  async edit(item: IonItemSliding, image: Image) {
    await this.navController.navigateForward('/tabs/entities/image/' + image.id + '/edit');
    await item.close();
  }

  async delete(image) {
    this.imageService.delete(image.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Image deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(image: Image) {
    await this.navController.navigateForward('/tabs/entities/image/' + image.id + '/view');
  }
}
