import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { CreateYourEventService } from './create-your-event-service.model';
import { CreateYourEventServiceService } from './create-your-event-service.service';

@Component({
  selector: 'page-create-your-event-service',
  templateUrl: 'create-your-event-service.html',
})
export class CreateYourEventServicePage {
  createYourEventServices: CreateYourEventService[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private createYourEventServiceService: CreateYourEventServiceService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.createYourEventServices = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.createYourEventServiceService
      .query()
      .pipe(
        filter((res: HttpResponse<CreateYourEventService[]>) => res.ok),
        map((res: HttpResponse<CreateYourEventService[]>) => res.body)
      )
      .subscribe(
        (response: CreateYourEventService[]) => {
          this.createYourEventServices = response;
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

  trackId(index: number, item: CreateYourEventService) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/create-your-event-service/new');
  }

  async edit(item: IonItemSliding, createYourEventService: CreateYourEventService) {
    await this.navController.navigateForward('/tabs/entities/create-your-event-service/' + createYourEventService.id + '/edit');
    await item.close();
  }

  async delete(createYourEventService) {
    this.createYourEventServiceService.delete(createYourEventService.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'CreateYourEventService deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(createYourEventService: CreateYourEventService) {
    await this.navController.navigateForward('/tabs/entities/create-your-event-service/' + createYourEventService.id + '/view');
  }
}
