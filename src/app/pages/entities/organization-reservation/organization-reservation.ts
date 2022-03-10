import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { OrganizationReservation } from './organization-reservation.model';
import { OrganizationReservationService } from './organization-reservation.service';

@Component({
  selector: 'page-organization-reservation',
  templateUrl: 'organization-reservation.html',
})
export class OrganizationReservationPage {
  organizationReservations: OrganizationReservation[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private organizationReservationService: OrganizationReservationService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.organizationReservations = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.organizationReservationService
      .query()
      .pipe(
        filter((res: HttpResponse<OrganizationReservation[]>) => res.ok),
        map((res: HttpResponse<OrganizationReservation[]>) => res.body)
      )
      .subscribe(
        (response: OrganizationReservation[]) => {
          this.organizationReservations = response;
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

  trackId(index: number, item: OrganizationReservation) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/organization-reservation/new');
  }

  async edit(item: IonItemSliding, organizationReservation: OrganizationReservation) {
    await this.navController.navigateForward('/tabs/entities/organization-reservation/' + organizationReservation.id + '/edit');
    await item.close();
  }

  async delete(organizationReservation) {
    this.organizationReservationService.delete(organizationReservation.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'OrganizationReservation deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(organizationReservation: OrganizationReservation) {
    await this.navController.navigateForward('/tabs/entities/organization-reservation/' + organizationReservation.id + '/view');
  }
}
