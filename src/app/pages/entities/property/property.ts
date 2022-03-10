import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Property } from './property.model';
import { PropertyService } from './property.service';

@Component({
  selector: 'page-property',
  templateUrl: 'property.html',
})
export class PropertyPage {
  properties: Property[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private propertyService: PropertyService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.properties = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.propertyService
      .query()
      .pipe(
        filter((res: HttpResponse<Property[]>) => res.ok),
        map((res: HttpResponse<Property[]>) => res.body)
      )
      .subscribe(
        (response: Property[]) => {
          this.properties = response;
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

  trackId(index: number, item: Property) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/property/new');
  }

  async edit(item: IonItemSliding, property: Property) {
    await this.navController.navigateForward('/tabs/entities/property/' + property.id + '/edit');
    await item.close();
  }

  async delete(property) {
    this.propertyService.delete(property.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Property deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(property: Property) {
    await this.navController.navigateForward('/tabs/entities/property/' + property.id + '/view');
  }
}
