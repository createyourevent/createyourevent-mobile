import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { Coupon } from './pages/entities/coupon';
import { Event } from './pages/entities/event';
import { EventStarRating } from './pages/entities/event-star-rating';
import { Reservation } from './pages/entities/reservation';
import { Ticket } from './pages/entities/ticket/ticket.model';
import { ApiService } from './services/api/api.service';
import { IUser } from './shared/model/user.model';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private resourceUrl = ApiService.API_URL + '/users';
  private resourceUrlCYE = ApiService.API_URL + '/users_createyourevent';
  private resourceUrlReservation = ApiService.API_URL + '/reservations';
  private resourceUrlEvent = ApiService.API_URL + '/events';
  private resourceUrlEventStarRatings = ApiService.API_URL + '/event-star-ratings';
  private resourceUrlTicket = ApiService.API_URL + '/tickets';
  private resourceUrlCoupons = ApiService.API_URL + '/coupons';

  constructor(protected http: HttpClient) {}

  findWidthAuthorities(): Observable<HttpResponse<IUser>> {
    return this.http.get<IUser>(`${this.resourceUrlCYE}/loggedIn`, { observe: 'response' });
  }

  findWidthAuthoritiesWidthId(id: string): Observable<HttpResponse<IUser>> {
    return this.http.get<IUser>(`${this.resourceUrl}/${id}/byId`, { observe: 'response' });
  }

  getReservationsByUser(userId: string): Observable<HttpResponse<Reservation[]>> {
    return this.http.get<Reservation[]>(`${this.resourceUrlReservation}/${userId}/getReservationsByUserId`, { observe: 'response' });
  }

  getReservationsByUserAndBilled(userId: string): Observable<HttpResponse<Reservation[]>> {
    return this.http.get<Reservation[]>(`${this.resourceUrlReservation}/${userId}/getReservationsByUserIdAndBilled`, {
      observe: 'response',
    });
  }

  findEventsByUserId(userId: string): Observable<HttpResponse<Event[]>> {
    return this.http.get<Event[]>(`${this.resourceUrlEvent}/user/active/${userId}`, { observe: 'response' });
  }

  findReservationsByEventId(eventId: number): Observable<HttpResponse<Reservation[]>> {
    return this.http.get<Reservation[]>(`${this.resourceUrlReservation}/${eventId}/getReservationsByEventId`, { observe: 'response' });
  }

  findEventsByPrivateOrPublicAndActiveTrueAndDateEndAfter(dateEnd: dayjs.Dayjs): Observable<HttpResponse<Event[]>> {
    const de = dateEnd.format();
    let params = new HttpParams();
    params = params.append('date', encodeURIComponent(de));
    return this.http.get<Event[]>(`${this.resourceUrlEvent}/dateEnd/public/active`, { params, observe: 'response' });
  }

  getEventStarRatingByEvent(eventId: number): Observable<HttpResponse<EventStarRating[]>> {
    return this.http.get<EventStarRating[]>(`${this.resourceUrlEventStarRatings}/${eventId}/getEventStarRatingByEvent`, {
      observe: 'response',
    });
  }

  findTicketsByEventId(eventId: number): Observable<HttpResponse<Ticket[]>> {
    return this.http.get<Ticket[]>(`${this.resourceUrlTicket}/${eventId}/getAllTicketsByEventId`, {
      observe: 'response',
    });
  }

  findTicketById(id: number): Observable<HttpResponse<Ticket>> {
    return this.http.get<Ticket>(`${this.resourceUrlTicket}/${id}/getOneById`, {
      observe: 'response',
    });
  }

  partialUpdateTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.resourceUrlTicket}/${ticket.id}}`, { observe: 'response' });
  }

  findCouponsByActiveUser(): Observable<HttpResponse<Coupon[]>> {
    return this.http.get<Coupon[]>(`${this.resourceUrlCoupons}/byUser`, {
      observe: 'response'
    });
  }

  findCouponsByUser(userId: string): Observable<HttpResponse<Coupon[]>> {
    return this.http.get<Coupon[]>(`${this.resourceUrlCoupons}/${userId}/byUser`, {
      observe: 'response'
    });
  }
}
