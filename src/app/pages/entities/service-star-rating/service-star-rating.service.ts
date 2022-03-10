import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ServiceStarRating } from './service-star-rating.model';

@Injectable({ providedIn: 'root' })
export class ServiceStarRatingService {
  private resourceUrl = ApiService.API_URL + '/service-star-ratings';

  constructor(protected http: HttpClient) {}

  create(serviceStarRating: ServiceStarRating): Observable<HttpResponse<ServiceStarRating>> {
    return this.http.post<ServiceStarRating>(this.resourceUrl, serviceStarRating, { observe: 'response' });
  }

  update(serviceStarRating: ServiceStarRating): Observable<HttpResponse<ServiceStarRating>> {
    return this.http.put(`${this.resourceUrl}/${serviceStarRating.id}`, serviceStarRating, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ServiceStarRating>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ServiceStarRating[]>> {
    const options = createRequestOption(req);
    return this.http.get<ServiceStarRating[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
