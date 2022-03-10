import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { SlotListClock } from './slot-list-clock.model';
import { SlotListClockService } from './slot-list-clock.service';

@Component({
  selector: 'page-slot-list-clock',
  templateUrl: 'slot-list-clock.html',
})
export class SlotListClockPage {
  slotListClocks: SlotListClock[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private slotListClockService: SlotListClockService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.slotListClocks = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.slotListClockService
      .query()
      .pipe(
        filter((res: HttpResponse<SlotListClock[]>) => res.ok),
        map((res: HttpResponse<SlotListClock[]>) => res.body)
      )
      .subscribe(
        (response: SlotListClock[]) => {
          this.slotListClocks = response;
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

  trackId(index: number, item: SlotListClock) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/slot-list-clock/new');
  }

  async edit(item: IonItemSliding, slotListClock: SlotListClock) {
    await this.navController.navigateForward('/tabs/entities/slot-list-clock/' + slotListClock.id + '/edit');
    await item.close();
  }

  async delete(slotListClock) {
    this.slotListClockService.delete(slotListClock.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'SlotListClock deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(slotListClock: SlotListClock) {
    await this.navController.navigateForward('/tabs/entities/slot-list-clock/' + slotListClock.id + '/view');
  }
}
