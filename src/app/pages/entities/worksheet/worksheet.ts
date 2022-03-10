import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Worksheet } from './worksheet.model';
import { WorksheetService } from './worksheet.service';

@Component({
  selector: 'page-worksheet',
  templateUrl: 'worksheet.html',
})
export class WorksheetPage {
  worksheets: Worksheet[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private worksheetService: WorksheetService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.worksheets = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.worksheetService
      .query()
      .pipe(
        filter((res: HttpResponse<Worksheet[]>) => res.ok),
        map((res: HttpResponse<Worksheet[]>) => res.body)
      )
      .subscribe(
        (response: Worksheet[]) => {
          this.worksheets = response;
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

  trackId(index: number, item: Worksheet) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/worksheet/new');
  }

  async edit(item: IonItemSliding, worksheet: Worksheet) {
    await this.navController.navigateForward('/tabs/entities/worksheet/' + worksheet.id + '/edit');
    await item.close();
  }

  async delete(worksheet) {
    this.worksheetService.delete(worksheet.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Worksheet deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(worksheet: Worksheet) {
    await this.navController.navigateForward('/tabs/entities/worksheet/' + worksheet.id + '/view');
  }
}
