import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { SlotListCherry } from './slot-list-cherry.model';
import { SlotListCherryService } from './slot-list-cherry.service';

@Component({
  selector: 'page-slot-list-cherry',
  templateUrl: 'slot-list-cherry.html',
})
export class SlotListCherryPage {
  slotListCherries: SlotListCherry[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private slotListCherryService: SlotListCherryService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.slotListCherries = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.slotListCherryService
      .query()
      .pipe(
        filter((res: HttpResponse<SlotListCherry[]>) => res.ok),
        map((res: HttpResponse<SlotListCherry[]>) => res.body)
      )
      .subscribe(
        (response: SlotListCherry[]) => {
          this.slotListCherries = response;
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

  trackId(index: number, item: SlotListCherry) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/slot-list-cherry/new');
  }

  async edit(item: IonItemSliding, slotListCherry: SlotListCherry) {
    await this.navController.navigateForward('/tabs/entities/slot-list-cherry/' + slotListCherry.id + '/edit');
    await item.close();
  }

  async delete(slotListCherry) {
    this.slotListCherryService.delete(slotListCherry.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'SlotListCherry deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(slotListCherry: SlotListCherry) {
    await this.navController.navigateForward('/tabs/entities/slot-list-cherry/' + slotListCherry.id + '/view');
  }
}
