import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { EventServiceMapOrder } from './event-service-map-order.model';

@Injectable({ providedIn: 'root' })
export class EventServiceMapOrderService {
  private resourceUrl = ApiService.API_URL + '/event-service-map-orders';

  constructor(protected http: HttpClient) {}

  create(eventServiceMapOrder: EventServiceMapOrder): Observable<HttpResponse<EventServiceMapOrder>> {
    return this.http.post<EventServiceMapOrder>(this.resourceUrl, eventServiceMapOrder, { observe: 'response' });
  }

  update(eventServiceMapOrder: EventServiceMapOrder): Observable<HttpResponse<EventServiceMapOrder>> {
    return this.http.put(`${this.resourceUrl}/${eventServiceMapOrder.id}`, eventServiceMapOrder, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<EventServiceMapOrder>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<EventServiceMapOrder[]>> {
    const options = createRequestOption(req);
    return this.http.get<EventServiceMapOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
