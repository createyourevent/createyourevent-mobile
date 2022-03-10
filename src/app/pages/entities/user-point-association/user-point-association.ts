import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { UserPointAssociation } from './user-point-association.model';
import { UserPointAssociationService } from './user-point-association.service';

@Component({
  selector: 'page-user-point-association',
  templateUrl: 'user-point-association.html',
})
export class UserPointAssociationPage {
  userPointAssociations: UserPointAssociation[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private userPointAssociationService: UserPointAssociationService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.userPointAssociations = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.userPointAssociationService
      .query()
      .pipe(
        filter((res: HttpResponse<UserPointAssociation[]>) => res.ok),
        map((res: HttpResponse<UserPointAssociation[]>) => res.body)
      )
      .subscribe(
        (response: UserPointAssociation[]) => {
          this.userPointAssociations = response;
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

  trackId(index: number, item: UserPointAssociation) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/user-point-association/new');
  }

  async edit(item: IonItemSliding, userPointAssociation: UserPointAssociation) {
    await this.navController.navigateForward('/tabs/entities/user-point-association/' + userPointAssociation.id + '/edit');
    await item.close();
  }

  async delete(userPointAssociation) {
    this.userPointAssociationService.delete(userPointAssociation.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'UserPointAssociation deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(userPointAssociation: UserPointAssociation) {
    await this.navController.navigateForward('/tabs/entities/user-point-association/' + userPointAssociation.id + '/view');
  }
}
