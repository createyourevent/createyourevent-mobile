import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { SlotListPlum } from './slot-list-plum.model';
import { SlotListPlumService } from './slot-list-plum.service';

@Component({
  selector: 'page-slot-list-plum',
  templateUrl: 'slot-list-plum.html',
})
export class SlotListPlumPage {
  slotListPlums: SlotListPlum[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private slotListPlumService: SlotListPlumService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.slotListPlums = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.slotListPlumService
      .query()
      .pipe(
        filter((res: HttpResponse<SlotListPlum[]>) => res.ok),
        map((res: HttpResponse<SlotListPlum[]>) => res.body)
      )
      .subscribe(
        (response: SlotListPlum[]) => {
          this.slotListPlums = response;
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

  trackId(index: number, item: SlotListPlum) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/slot-list-plum/new');
  }

  async edit(item: IonItemSliding, slotListPlum: SlotListPlum) {
    await this.navController.navigateForward('/tabs/entities/slot-list-plum/' + slotListPlum.id + '/edit');
    await item.close();
  }

  async delete(slotListPlum) {
    this.slotListPlumService.delete(slotListPlum.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'SlotListPlum deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(slotListPlum: SlotListPlum) {
    await this.navController.navigateForward('/tabs/entities/slot-list-plum/' + slotListPlum.id + '/view');
  }
}
