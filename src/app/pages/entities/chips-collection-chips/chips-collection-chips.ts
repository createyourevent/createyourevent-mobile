import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ChipsCollectionChips } from './chips-collection-chips.model';
import { ChipsCollectionChipsService } from './chips-collection-chips.service';

@Component({
  selector: 'page-chips-collection-chips',
  templateUrl: 'chips-collection-chips.html',
})
export class ChipsCollectionChipsPage {
  chipsCollectionChips: ChipsCollectionChips[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private chipsCollectionChipsService: ChipsCollectionChipsService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.chipsCollectionChips = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.chipsCollectionChipsService
      .query()
      .pipe(
        filter((res: HttpResponse<ChipsCollectionChips[]>) => res.ok),
        map((res: HttpResponse<ChipsCollectionChips[]>) => res.body)
      )
      .subscribe(
        (response: ChipsCollectionChips[]) => {
          this.chipsCollectionChips = response;
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

  trackId(index: number, item: ChipsCollectionChips) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/chips-collection-chips/new');
  }

  async edit(item: IonItemSliding, chipsCollectionChips: ChipsCollectionChips) {
    await this.navController.navigateForward('/tabs/entities/chips-collection-chips/' + chipsCollectionChips.id + '/edit');
    await item.close();
  }

  async delete(chipsCollectionChips) {
    this.chipsCollectionChipsService.delete(chipsCollectionChips.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'ChipsCollectionChips deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(chipsCollectionChips: ChipsCollectionChips) {
    await this.navController.navigateForward('/tabs/entities/chips-collection-chips/' + chipsCollectionChips.id + '/view');
  }
}
