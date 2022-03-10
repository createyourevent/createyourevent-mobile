import { Component, OnInit } from '@angular/core';
import { FeeBalance } from './fee-balance.model';
import { FeeBalanceService } from './fee-balance.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-fee-balance-detail',
  templateUrl: 'fee-balance-detail.html',
})
export class FeeBalanceDetailPage implements OnInit {
  feeBalance: FeeBalance = {};

  constructor(
    private navController: NavController,
    private feeBalanceService: FeeBalanceService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.feeBalance = response.data;
    });
  }

  open(item: FeeBalance) {
    this.navController.navigateForward('/tabs/entities/fee-balance/' + item.id + '/edit');
  }

  async deleteModal(item: FeeBalance) {
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
            this.feeBalanceService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/fee-balance');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
