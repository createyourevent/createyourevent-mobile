import { ReservationService } from './../entities/reservation/reservation.service';
import { IUser } from './../../shared/model/user.model';
import { GeneralService } from './../../general.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AccountService } from 'src/app/services/auth/account.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Account } from 'src/model/account.model';
import { Reservation } from '../entities/reservation';
import { NavigationExtras, Router } from '@angular/router';
import { Ticket } from '../entities/ticket/ticket.model';
import { TicketService } from '../entities/ticket/ticket.service';

@Component({
  selector: 'app-tickets',
  templateUrl: 'tickets.page.html',
  styleUrls: ['tickets.page.scss'],
})
export class TicketsPage implements OnInit {
  account: Account;
  reservations: Reservation[] = [];

  constructor(
    public navController: NavController,
    private accountService: AccountService,
    private loginService: LoginService,
    private generalService: GeneralService,
    private reservationService: ReservationService,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.accountService.identity().then((account) => {
      if (account === null) {
        this.goBackToHomePage();
      } else {
        this.account = account;
        this.generalService.getReservationsByUserAndBilled(account.id).subscribe((t) => {
          this.reservations = t.body;
        });
      }
    });
  }

  gotoBarcode(reservationId: number) {
    this.reservationService.find(reservationId).subscribe((res) => {
      const r = res.body;
      const navigationExtras: NavigationExtras = {
        state: {
          reservation: r,
        },
      };
      this.router.navigate(['/tabs/tickets/barcode'], navigationExtras);
    });
  }

  private goBackToHomePage(): void {
    this.navController.navigateRoot('');
  }
}
