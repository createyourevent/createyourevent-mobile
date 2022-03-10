import { Component, OnInit } from '@angular/core';
import { Worksheet } from './worksheet.model';
import { WorksheetService } from './worksheet.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-worksheet-detail',
  templateUrl: 'worksheet-detail.html',
})
export class WorksheetDetailPage implements OnInit {
  worksheet: Worksheet = {};

  constructor(
    private navController: NavController,
    private worksheetService: WorksheetService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.worksheet = response.data;
    });
  }

  open(item: Worksheet) {
    this.navController.navigateForward('/tabs/entities/worksheet/' + item.id + '/edit');
  }

  async deleteModal(item: Worksheet) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.worksheetService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/worksheet');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
