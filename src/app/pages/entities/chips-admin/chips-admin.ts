import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ChipsAdmin } from './chips-admin.model';
import { ChipsAdminService } from './chips-admin.service';

@Component({
  selector: 'page-chips-admin',
  templateUrl: 'chips-admin.html',
})
export class ChipsAdminPage {
  chipsAdmins: ChipsAdmin[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private chipsAdminService: ChipsAdminService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.chipsAdmins = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.chipsAdminService
      .query()
      .pipe(
        filter((res: HttpResponse<ChipsAdmin[]>) => res.ok),
        map((res: HttpResponse<ChipsAdmin[]>) => res.body)
      )
      .subscribe(
        (response: ChipsAdmin[]) => {
          this.chipsAdmins = response;
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

  trackId(index: number, item: ChipsAdmin) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/chips-admin/new');
  }

  async edit(item: IonItemSliding, chipsAdmin: ChipsAdmin) {
    await this.navController.navigateForward('/tabs/entities/chips-admin/' + chipsAdmin.id + '/edit');
    await item.close();
  }

  async delete(chipsAdmin) {
    this.chipsAdminService.delete(chipsAdmin.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ChipsAdmin deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(chipsAdmin: ChipsAdmin) {
    await this.navController.navigateForward('/tabs/entities/chips-admin/' + chipsAdmin.id + '/view');
  }
}
