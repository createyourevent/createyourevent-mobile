import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ServiceOffer } from './service-offer.model';

@Injectable({ providedIn: 'root' })
export class ServiceOfferService {
  private resourceUrl = ApiService.API_URL + '/service-offers';

  constructor(protected http: HttpClient) {}

  create(serviceOffer: ServiceOffer): Observable<HttpResponse<ServiceOffer>> {
    return this.http.post<ServiceOffer>(this.resourceUrl, serviceOffer, { observe: 'response' });
  }

  update(serviceOffer: ServiceOffer): Observable<HttpResponse<ServiceOffer>> {
    return this.http.put(`${this.resourceUrl}/${serviceOffer.id}`, serviceOffer, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ServiceOffer>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ServiceOffer[]>> {
    const options = createRequestOption(req);
    return this.http.get<ServiceOffer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
