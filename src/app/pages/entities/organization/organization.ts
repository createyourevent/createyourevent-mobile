import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Organization } from './organization.model';
import { OrganizationService } from './organization.service';

@Component({
  selector: 'page-organization',
  templateUrl: 'organization.html',
})
export class OrganizationPage {
  organizations: Organization[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private organizationService: OrganizationService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.organizations = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.organizationService
      .query()
      .pipe(
        filter((res: HttpResponse<Organization[]>) => res.ok),
        map((res: HttpResponse<Organization[]>) => res.body)
      )
      .subscribe(
        (response: Organization[]) => {
          this.organizations = response;
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

  trackId(index: number, item: Organization) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/organization/new');
  }

  async edit(item: IonItemSliding, organization: Organization) {
    await this.navController.navigateForward('/tabs/entities/organization/' + organization.id + '/edit');
    await item.close();
  }

  async delete(organization) {
    this.organizationService.delete(organization.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Organization deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(organization: Organization) {
    await this.navController.navigateForward('/tabs/entities/organization/' + organization.id + '/view');
  }
}
