import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { EventProductOrder } from './event-product-order.model';

@Injectable({ providedIn: 'root' })
export class EventProductOrderService {
  private resourceUrl = ApiService.API_URL + '/event-product-orders';

  constructor(protected http: HttpClient) {}

  create(eventProductOrder: EventProductOrder): Observable<HttpResponse<EventProductOrder>> {
    return this.http.post<EventProductOrder>(this.resourceUrl, eventProductOrder, { observe: 'response' });
  }

  update(eventProductOrder: EventProductOrder): Observable<HttpResponse<EventProductOrder>> {
    return this.http.put(`${this.resourceUrl}/${eventProductOrder.id}`, eventProductOrder, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<EventProductOrder>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<EventProductOrder[]>> {
    const options = createRequestOption(req);
    return this.http.get<EventProductOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
