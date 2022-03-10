import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Club } from './club.model';
import { ClubService } from './club.service';

@Component({
  selector: 'page-club',
  templateUrl: 'club.html',
})
export class ClubPage {
  clubs: Club[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private clubService: ClubService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.clubs = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.clubService
      .query()
      .pipe(
        filter((res: HttpResponse<Club[]>) => res.ok),
        map((res: HttpResponse<Club[]>) => res.body)
      )
      .subscribe(
        (response: Club[]) => {
          this.clubs = response;
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

  trackId(index: number, item: Club) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/club/new');
  }

  async edit(item: IonItemSliding, club: Club) {
    await this.navController.navigateForward('/tabs/entities/club/' + club.id + '/edit');
    await item.close();
  }

  async delete(club) {
    this.clubService.delete(club.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Club deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(club: Club) {
    await this.navController.navigateForward('/tabs/entities/club/' + club.id + '/view');
  }
}
