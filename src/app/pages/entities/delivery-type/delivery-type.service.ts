import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { DeliveryType } from './delivery-type.model';

@Injectable({ providedIn: 'root' })
export class DeliveryTypeService {
  private resourceUrl = ApiService.API_URL + '/delivery-types';

  constructor(protected http: HttpClient) {}

  create(deliveryType: DeliveryType): Observable<HttpResponse<DeliveryType>> {
    return this.http.post<DeliveryType>(this.resourceUrl, deliveryType, { observe: 'response' });
  }

  update(deliveryType: DeliveryType): Observable<HttpResponse<DeliveryType>> {
    return this.http.put(`${this.resourceUrl}/${deliveryType.id}`, deliveryType, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<DeliveryType>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<DeliveryType[]>> {
    const options = createRequestOption(req);
    return this.http.get<DeliveryType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
