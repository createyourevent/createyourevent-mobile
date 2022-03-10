import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Building } from './building.model';
import { BuildingService } from './building.service';

@Component({
  selector: 'page-building',
  templateUrl: 'building.html',
})
export class BuildingPage {
  buildings: Building[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private buildingService: BuildingService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.buildings = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.buildingService
      .query()
      .pipe(
        filter((res: HttpResponse<Building[]>) => res.ok),
        map((res: HttpResponse<Building[]>) => res.body)
      )
      .subscribe(
        (response: Building[]) => {
          this.buildings = response;
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

  trackId(index: number, item: Building) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/building/new');
  }

  async edit(item: IonItemSliding, building: Building) {
    await this.navController.navigateForward('/tabs/entities/building/' + building.id + '/edit');
    await item.close();
  }

  async delete(building) {
    this.buildingService.delete(building.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Building deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(building: Building) {
    await this.navController.navigateForward('/tabs/entities/building/' + building.id + '/view');
  }
}
