import { Component, OnInit } from '@angular/core';
import { FeeTransaction } from './fee-transaction.model';
import { FeeTransactionService } from './fee-transaction.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-fee-transaction-detail',
  templateUrl: 'fee-transaction-detail.html',
})
export class FeeTransactionDetailPage implements OnInit {
  feeTransaction: FeeTransaction = {};

  constructor(
    private navController: NavController,
    private feeTransactionService: FeeTransactionService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.feeTransaction = response.data;
    });
  }

  open(item: FeeTransaction) {
    this.navController.navigateForward('/tabs/entities/fee-transaction/' + item.id + '/edit');
  }

  async deleteModal(item: FeeTransaction) {
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
            this.feeTransactionService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/fee-transaction');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
