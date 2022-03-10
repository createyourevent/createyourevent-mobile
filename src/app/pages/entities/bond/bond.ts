import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Bond } from './bond.model';
import { BondService } from './bond.service';

@Component({
  selector: 'page-bond',
  templateUrl: 'bond.html',
})
export class BondPage {
  bonds: Bond[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private bondService: BondService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.bonds = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.bondService
      .query()
      .pipe(
        filter((res: HttpResponse<Bond[]>) => res.ok),
        map((res: HttpResponse<Bond[]>) => res.body)
      )
      .subscribe(
        (response: Bond[]) => {
          this.bonds = response;
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

  trackId(index: number, item: Bond) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/bond/new');
  }

  async edit(item: IonItemSliding, bond: Bond) {
    await this.navController.navigateForward('/tabs/entities/bond/' + bond.id + '/edit');
    await item.close();
  }

  async delete(bond) {
    this.bondService.delete(bond.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Bond deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(bond: Bond) {
    await this.navController.navigateForward('/tabs/entities/bond/' + bond.id + '/view');
  }
}
