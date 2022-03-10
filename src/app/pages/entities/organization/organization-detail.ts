import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Organization } from './organization.model';
import { OrganizationService } from './organization.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-organization-detail',
  templateUrl: 'organization-detail.html',
})
export class OrganizationDetailPage implements OnInit {
  organization: Organization = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private organizationService: OrganizationService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.organization = response.data;
    });
  }

  open(item: Organization) {
    this.navController.navigateForward('/tabs/entities/organization/' + item.id + '/edit');
  }

  async deleteModal(item: Organization) {
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
            this.organizationService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/organization');
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
