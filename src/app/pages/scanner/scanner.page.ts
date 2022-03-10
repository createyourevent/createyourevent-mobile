import { EventService } from './../entities/event/event.service';
import { UserService } from './../../services/user/user.service';
import { TicketService } from './../entities/ticket/ticket.service';
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
import { Account } from 'src/model/account.model';
import { AccountService } from 'src/app/services/auth/account.service';
import { ConnectivityProvider } from 'src/app/services/network/connectivityProvider.service';
import { DatabaseService } from 'src/app/database.service';
import { Ticket } from '../entities/ticket';

@Component({
  selector: 'app-scanner',
  templateUrl: 'scanner.page.html',
  styleUrls: ['scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  optionZbar: any;
  scannedOutput: any;
  reservationId: number;
  userId: string;
  eventId: number;
  email: string;
  eventName: string;
  reservation: Reservation;
  events: Event[];
  event: Event = null;
  user: IUser;
  checkEventId: number;
  account: Account;
  onOffLine: boolean;
  syncEventName: string;
  syncEventId: number;
  showInfo = false;
  ticket: Ticket;

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
    private databaseService: DatabaseService,
    private ticketService: TicketService,
    private userService: UserService,
    private eventService: EventService
  ) {
    this.optionZbar = {
      flash: 'off',
      drawSight: false,
    };
  }

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

  ionViewWillEnter() {
    this.connectivityProvider.appIsOnline$.subscribe((online) => {
      console.log(online);
      if (online) {
        this.onOffLine = true;
      } else {
        this.onOffLine = false;
      }
    });
    this.databaseService.getEventName().then((res) => {
      this.syncEventName = res;
    });
    this.databaseService.getEventId().then((res) => {
      this.syncEventId = res;
    });
  }

  syncEvents(): void {
    this.databaseService.deleteDatabase();
    this.databaseService.seedDatabase().then(() => {
      this.databaseService.insertReservationInfo(this.checkEventId).then(() => {
        this.databaseService.getEventName().then((res) => {
          this.syncEventName = res;
          this.databaseService.insertReservations(this.checkEventId);
          this.databaseService.insertTickets(this.checkEventId);
        });
      });
    });
  }

  uploadSync(): void {
    this.databaseService.loadReservations().then(() => {
      this.databaseService.getReservations().subscribe((res) => {
        const reservations = res;
        reservations.forEach((reservation) => {
          this.reservationService.find(reservation.id).subscribe((re) => {
            const r = re.body;
            r.accessEvent = reservation.accessEvent === 0 ? false : true;
            r.accessDate = dayjs(reservation.accessDate);
            this.reservationService.update(r).subscribe();
          });
        });
        this.databaseService.loadTickets().then(() => {
          this.databaseService.getTickets().subscribe((rest) => {
            const tickets = rest;
            tickets.forEach((ticket) => {
              this.ticketService.find(ticket.id).subscribe((ti) => {
                const t = ti.body;
                t.ticketsUsed = ticket.ticketsUsed;
                t.accessDate = dayjs(ticket.accessDate);
                this.ticketService.update(t).subscribe();
              });
            });
            this.syncUploaded();
          });
        });
      });
    });
  }

  checkTicketValidity() {
    this.showInfo = false;
    this.zbarPlugin
      .scan(this.optionZbar)
      .then((respone) => {
        let infoArr: string[] = [];
        this.scannedOutput = respone;
        infoArr = this.scannedOutput.split(',,,');
        this.reservationId = Number(infoArr[2]);
        this.userId = infoArr[0];
        this.eventId = Number(infoArr[1]);
        this.email = infoArr[3];
        this.eventName = infoArr[4];
        this.reservationService.find(this.reservationId).subscribe((res) => {
          this.reservation = res.body;
          if (!this.reservation) {
            this.presentWrongEvent();
          } else {
            this.ticket = this.reservation.ticket;
            if (this.ticket.ticketsUsed === null) {
              this.ticket.ticketsUsed = 0;
            }
            this.ticket.ticketsUsed += 1;
            if (this.reservation.event.id !== this.checkEventId) {
              this.presentWrongEvent();
            } else if (this.reservation.accessEvent === true && this.ticket.ticketsUsed > this.ticket.amount) {
              this.presentInvalidTicket(this.reservation.accessDate);
            } else {
              this.presentValidTicket();
            }
          }
        });
      })
      .catch((error) => {
        alert(error);
      });
  }

  barcodeScanner() {
    this.showInfo = false;
    this.zbarPlugin
      .scan(this.optionZbar)
      .then((respone) => {
        let infoArr: string[] = [];
        this.scannedOutput = respone;
        infoArr = this.scannedOutput.split(',,,');
        this.reservationId = Number(infoArr[2]);
        this.userId = infoArr[0];
        this.eventId = Number(infoArr[1]);
        this.email = infoArr[3];
        this.eventName = infoArr[4];

        this.reservationService.find(this.reservationId).subscribe((res) => {
          this.reservation = res.body;
          if (!this.reservation) {
            this.presentWrongEvent();
          } else {
            this.ticket = this.reservation.ticket;
            this.reservation.accessEvent = true;
            this.reservation.accessDate = dayjs();
            if (this.ticket.ticketsUsed === null) {
              this.ticket.ticketsUsed = 1;
              this.ticket.accessDate = dayjs();
            } else {
              if (this.ticket.ticketsUsed === null) {
                this.ticket.ticketsUsed = 0;
              }
              this.ticket.ticketsUsed += 1;
              this.ticket.accessDate = dayjs();
            }
            if (this.reservation.event.id !== this.checkEventId) {
              this.presentWrongEvent();
            } else if (this.reservation.accessEvent === true && this.ticket.ticketsUsed > this.ticket.amount) {
              this.presentInvalidTicket(this.reservation.accessDate);
            } else {
              this.ticketService.update(this.ticket).subscribe(() => {
                this.reservationService.update(this.reservation).subscribe((r) => {
                  this.presentValidTicket();
                });
              });
            }
          }
        });
      })
      .catch((error) => {
        alert(error);
      });
  }

  sync() {
    this.reservationService.query().subscribe((res) => {
      const reservations = res.body;
      reservations.forEach((element) => {
        this.databaseService.insertReservations(this.checkEventId);
      });
    });
  }

  onChange(e: any) {
    this.checkEventId = Number(e.target.value);
    // this.sync();
  }

  async notOwnEvent() {
    const toast = await this.toastController.create({
      message: 'Not a ticket from this event.',
      duration: 4000,
      color: 'warning',
    });
    toast.present();
  }

  async syncUploaded() {
    const toast = await this.toastController.create({
      message: this.translate.instant('SYNC_UPLOADED'),
      duration: 4000,
      color: 'success',
    });
    toast.present();
  }

  async presentValidTicket() {
    this.showInfo = true;
    const toast = await this.toastController.create({
      message: this.translate.instant('VALID_TICKET'),
      duration: 4000,
      color: 'success',
    });
    toast.present();
  }

  async presentInvalidTicket(date: dayjs.Dayjs) {
    this.showInfo = false;
    const toast = await this.toastController.create({
      message:
        this.translate.instant('INVALID_TICKET') +
        '. <br/>' +
        this.translate.instant('USED') +
        ' ' +
        this.datePipe.transform(dayjs(date).toDate(), 'medium'),
      duration: 4000,
      color: 'warning',
    });
    toast.present();
  }

  async presentWrongEvent() {
    this.showInfo = false;
    const toast = await this.toastController.create({
      message: this.translate.instant('TICKET_NOT_FROM_EVENT'),
      duration: 4000,
      color: 'warning',
    });
    toast.present();
  }

  private goBackToHomePage(): void {
    this.navController.navigateRoot('');
  }
}
