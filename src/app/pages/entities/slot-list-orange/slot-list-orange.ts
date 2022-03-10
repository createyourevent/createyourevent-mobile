import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { SlotListOrange } from './slot-list-orange.model';
import { SlotListOrangeService } from './slot-list-orange.service';

@Component({
  selector: 'page-slot-list-orange',
  templateUrl: 'slot-list-orange.html',
})
export class SlotListOrangePage {
  slotListOranges: SlotListOrange[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private slotListOrangeService: SlotListOrangeService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.slotListOranges = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.slotListOrangeService
      .query()
      .pipe(
        filter((res: HttpResponse<SlotListOrange[]>) => res.ok),
        map((res: HttpResponse<SlotListOrange[]>) => res.body)
      )
      .subscribe(
        (response: SlotListOrange[]) => {
          this.slotListOranges = response;
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

  trackId(index: number, item: SlotListOrange) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/slot-list-orange/new');
  }

  async edit(item: IonItemSliding, slotListOrange: SlotListOrange) {
    await this.navController.navigateForward('/tabs/entities/slot-list-orange/' + slotListOrange.id + '/edit');
    await item.close();
  }

  async delete(slotListOrange) {
    this.slotListOrangeService.delete(slotListOrange.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'SlotListOrange deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(slotListOrange: SlotListOrange) {
    await this.navController.navigateForward('/tabs/entities/slot-list-orange/' + slotListOrange.id + '/view');
  }
}
