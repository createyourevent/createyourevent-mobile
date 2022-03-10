import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ChipsCollection } from './chips-collection.model';
import { ChipsCollectionService } from './chips-collection.service';

@Component({
  selector: 'page-chips-collection',
  templateUrl: 'chips-collection.html',
})
export class ChipsCollectionPage {
  chipsCollections: ChipsCollection[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private chipsCollectionService: ChipsCollectionService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.chipsCollections = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.chipsCollectionService
      .query()
      .pipe(
        filter((res: HttpResponse<ChipsCollection[]>) => res.ok),
        map((res: HttpResponse<ChipsCollection[]>) => res.body)
      )
      .subscribe(
        (response: ChipsCollection[]) => {
          this.chipsCollections = response;
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

  trackId(index: number, item: ChipsCollection) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/chips-collection/new');
  }

  async edit(item: IonItemSliding, chipsCollection: ChipsCollection) {
    await this.navController.navigateForward('/tabs/entities/chips-collection/' + chipsCollection.id + '/edit');
    await item.close();
  }

  async delete(chipsCollection) {
    this.chipsCollectionService.delete(chipsCollection.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ChipsCollection deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(chipsCollection: ChipsCollection) {
    await this.navController.navigateForward('/tabs/entities/chips-collection/' + chipsCollection.id + '/view');
  }
}
