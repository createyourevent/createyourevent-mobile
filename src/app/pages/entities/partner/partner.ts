import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Partner } from './partner.model';
import { PartnerService } from './partner.service';

@Component({
  selector: 'page-partner',
  templateUrl: 'partner.html',
})
export class PartnerPage {
  partners: Partner[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private partnerService: PartnerService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.partners = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.partnerService
      .query()
      .pipe(
        filter((res: HttpResponse<Partner[]>) => res.ok),
        map((res: HttpResponse<Partner[]>) => res.body)
      )
      .subscribe(
        (response: Partner[]) => {
          this.partners = response;
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

  trackId(index: number, item: Partner) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/partner/new');
  }

  async edit(item: IonItemSliding, partner: Partner) {
    await this.navController.navigateForward('/tabs/entities/partner/' + partner.id + '/edit');
    await item.close();
  }

  async delete(partner) {
    this.partnerService.delete(partner.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Partner deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(partner: Partner) {
    await this.navController.navigateForward('/tabs/entities/partner/' + partner.id + '/view');
  }
}
