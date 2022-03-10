import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { UserExtension } from './user-extension.model';
import { UserExtensionService } from './user-extension.service';

@Component({
  selector: 'page-user-extension',
  templateUrl: 'user-extension.html',
})
export class UserExtensionPage {
  userExtensions: UserExtension[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private userExtensionService: UserExtensionService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.userExtensions = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.userExtensionService
      .query()
      .pipe(
        filter((res: HttpResponse<UserExtension[]>) => res.ok),
        map((res: HttpResponse<UserExtension[]>) => res.body)
      )
      .subscribe(
        (response: UserExtension[]) => {
          this.userExtensions = response;
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

  trackId(index: number, item: UserExtension) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/user-extension/new');
  }

  async edit(item: IonItemSliding, userExtension: UserExtension) {
    await this.navController.navigateForward('/tabs/entities/user-extension/' + userExtension.id + '/edit');
    await item.close();
  }

  async delete(userExtension) {
    this.userExtensionService.delete(userExtension.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'UserExtension deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(userExtension: UserExtension) {
    await this.navController.navigateForward('/tabs/entities/user-extension/' + userExtension.id + '/view');
  }
}
