import { Component, OnInit } from '@angular/core';
import { FeeTransactionId } from './fee-transaction-id.model';
import { FeeTransactionIdService } from './fee-transaction-id.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-fee-transaction-id-detail',
  templateUrl: 'fee-transaction-id-detail.html',
})
export class FeeTransactionIdDetailPage implements OnInit {
  feeTransactionId: FeeTransactionId = {};

  constructor(
    private navController: NavController,
    private feeTransactionIdService: FeeTransactionIdService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.feeTransactionId = response.data;
    });
  }

  open(item: FeeTransactionId) {
    this.navController.navigateForward('/tabs/entities/fee-transaction-id/' + item.id + '/edit');
  }

  async deleteModal(item: FeeTransactionId) {
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
            this.feeTransactionIdService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/fee-transaction-id');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
