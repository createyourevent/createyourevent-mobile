import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Club } from './club.model';
import { ClubService } from './club.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-club-detail',
  templateUrl: 'club-detail.html',
})
export class ClubDetailPage implements OnInit {
  club: Club = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private clubService: ClubService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.club = response.data;
    });
  }

  open(item: Club) {
    this.navController.navigateForward('/tabs/entities/club/' + item.id + '/edit');
  }

  async deleteModal(item: Club) {
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
            this.clubService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/club');
            });
          },
        },
      ],
    });
    await alert.present();
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
}
