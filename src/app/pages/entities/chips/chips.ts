import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Chips } from './chips.model';
import { ChipsService } from './chips.service';

@Component({
  selector: 'page-chips',
  templateUrl: 'chips.html',
})
export class ChipsPage {
  chips: Chips[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private chipsService: ChipsService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.chips = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.chipsService
      .query()
      .pipe(
        filter((res: HttpResponse<Chips[]>) => res.ok),
        map((res: HttpResponse<Chips[]>) => res.body)
      )
      .subscribe(
        (response: Chips[]) => {
          this.chips = response;
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

  trackId(index: number, item: Chips) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/chips/new');
  }

  async edit(item: IonItemSliding, chips: Chips) {
    await this.navController.navigateForward('/tabs/entities/chips/' + chips.id + '/edit');
    await item.close();
  }

  async delete(chips) {
    this.chipsService.delete(chips.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Chips deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(chips: Chips) {
    await this.navController.navigateForward('/tabs/entities/chips/' + chips.id + '/view');
  }
}
