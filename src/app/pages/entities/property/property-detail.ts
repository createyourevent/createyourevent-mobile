import { Component, OnInit } from '@angular/core';
import { Property } from './property.model';
import { PropertyService } from './property.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-property-detail',
  templateUrl: 'property-detail.html',
})
export class PropertyDetailPage implements OnInit {
  property: Property = {};

  constructor(
    private navController: NavController,
    private propertyService: PropertyService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.property = response.data;
    });
  }

  open(item: Property) {
    this.navController.navigateForward('/tabs/entities/property/' + item.id + '/edit');
  }

  async deleteModal(item: Property) {
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
            this.propertyService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/property');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
