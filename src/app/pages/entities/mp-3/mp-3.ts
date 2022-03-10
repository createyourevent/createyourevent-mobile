import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Mp3 } from './mp-3.model';
import { Mp3Service } from './mp-3.service';

@Component({
  selector: 'page-mp-3',
  templateUrl: 'mp-3.html',
})
export class Mp3Page {
  mp3s: Mp3[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private mp3Service: Mp3Service,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.mp3s = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.mp3Service
      .query()
      .pipe(
        filter((res: HttpResponse<Mp3[]>) => res.ok),
        map((res: HttpResponse<Mp3[]>) => res.body)
      )
      .subscribe(
        (response: Mp3[]) => {
          this.mp3s = response;
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

  trackId(index: number, item: Mp3) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/mp-3/new');
  }

  async edit(item: IonItemSliding, mp3: Mp3) {
    await this.navController.navigateForward('/tabs/entities/mp-3/' + mp3.id + '/edit');
    await item.close();
  }

  async delete(mp3) {
    this.mp3Service.delete(mp3.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Mp3 deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(mp3: Mp3) {
    await this.navController.navigateForward('/tabs/entities/mp-3/' + mp3.id + '/view');
  }
}
