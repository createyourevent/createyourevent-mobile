import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { OrganizationComment } from './organization-comment.model';
import { OrganizationCommentService } from './organization-comment.service';

@Component({
  selector: 'page-organization-comment',
  templateUrl: 'organization-comment.html',
})
export class OrganizationCommentPage {
  organizationComments: OrganizationComment[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private organizationCommentService: OrganizationCommentService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.organizationComments = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.organizationCommentService
      .query()
      .pipe(
        filter((res: HttpResponse<OrganizationComment[]>) => res.ok),
        map((res: HttpResponse<OrganizationComment[]>) => res.body)
      )
      .subscribe(
        (response: OrganizationComment[]) => {
          this.organizationComments = response;
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

  trackId(index: number, item: OrganizationComment) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/organization-comment/new');
  }

  async edit(item: IonItemSliding, organizationComment: OrganizationComment) {
    await this.navController.navigateForward('/tabs/entities/organization-comment/' + organizationComment.id + '/edit');
    await item.close();
  }

  async delete(organizationComment) {
    this.organizationCommentService.delete(organizationComment.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'OrganizationComment deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(organizationComment: OrganizationComment) {
    await this.navController.navigateForward('/tabs/entities/organization-comment/' + organizationComment.id + '/view');
  }
}
