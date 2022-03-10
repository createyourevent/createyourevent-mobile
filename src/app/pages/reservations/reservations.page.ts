import { IUser } from './../../shared/model/user.model';
import { GeneralService } from './../../general.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ZBar } from '@ionic-native/zbar/ngx';
import { Reservation, ReservationService } from '../entities/reservation';
import { ToastController } from '@ionic/angular';
import { Event } from '../entities/event';
import * as dayjs from 'dayjs';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { AccountService } from 'src/app/services/auth/account.service';
import { ConnectivityProvider } from 'src/app/services/network/connectivityProvider.service';
import { DatabaseService } from 'src/app/database.service';

@Component({
  selector: 'app-reservations',
  templateUrl: 'reservations.page.html',
  styleUrls: ['reservations.page.scss'],
})
export class ReservationsPage implements OnInit {
  events: Event[];
  event: Event;
  user: IUser;
  reservations: Reservation[] = [];
  tickets = 0;

  constructor(
    public navController: NavController,
    private zbarPlugin: ZBar,
    private reservationService: ReservationService,
    public toastController: ToastController,
    private generalService: GeneralService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private accountService: AccountService,
    private connectivityProvider: ConnectivityProvider,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().then((account) => {
      if (account === null) {
        this.goBackToHomePage();
      } else {
        this.generalService.findWidthAuthorities().subscribe((u) => {
          this.user = u.body;
          this.generalService.findEventsByUserId(account.id).subscribe((es) => {
            this.events = es.body;
          });
        });
      }
    });
  }

  ionViewWillEnter() {}

  totalPersons(): number {
    let total = 0;
    this.reservations.forEach((element) => {
      if (element.accessEvent) {
        total += element.ticket.ticketsUsed;
      }
    });
    return total;
  }

  onChange(e: any) {
    this.tickets = 0;
    const checkEventId = Number(e.target.value);
    this.generalService.findReservationsByEventId(checkEventId).subscribe((res) => {
      this.reservations = res.body;
      this.reservations.forEach((reservation) => {
        this.tickets += reservation.ticket.amount;
      });
    });
    // this.sync();
  }

  private goBackToHomePage(): void {
    this.navController.navigateRoot('');
  }
}
