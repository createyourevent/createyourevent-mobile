import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Tags } from './tags.model';
import { TagsService } from './tags.service';

@Component({
  selector: 'page-tags',
  templateUrl: 'tags.html',
})
export class TagsPage {
  tags: Tags[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private tagsService: TagsService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.tags = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.tagsService
      .query()
      .pipe(
        filter((res: HttpResponse<Tags[]>) => res.ok),
        map((res: HttpResponse<Tags[]>) => res.body)
      )
      .subscribe(
        (response: Tags[]) => {
          this.tags = response;
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

  trackId(index: number, item: Tags) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/tags/new');
  }

  async edit(item: IonItemSliding, tags: Tags) {
    await this.navController.navigateForward('/tabs/entities/tags/' + tags.id + '/edit');
    await item.close();
  }

  async delete(tags) {
    this.tagsService.delete(tags.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Tags deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(tags: Tags) {
    await this.navController.navigateForward('/tabs/entities/tags/' + tags.id + '/view');
  }
}
