import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { EventProductRating } from './event-product-rating.model';

@Injectable({ providedIn: 'root' })
export class EventProductRatingService {
  private resourceUrl = ApiService.API_URL + '/event-product-ratings';

  constructor(protected http: HttpClient) {}

  create(eventProductRating: EventProductRating): Observable<HttpResponse<EventProductRating>> {
    return this.http.post<EventProductRating>(this.resourceUrl, eventProductRating, { observe: 'response' });
  }

  update(eventProductRating: EventProductRating): Observable<HttpResponse<EventProductRating>> {
    return this.http.put(`${this.resourceUrl}/${eventProductRating.id}`, eventProductRating, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<EventProductRating>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<EventProductRating[]>> {
    const options = createRequestOption(req);
    return this.http.get<EventProductRating[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
