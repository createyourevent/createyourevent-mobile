import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { AdminFeesPrice } from './admin-fees-price.model';

@Injectable({ providedIn: 'root' })
export class AdminFeesPriceService {
  private resourceUrl = ApiService.API_URL + '/admin-fees-prices';

  constructor(protected http: HttpClient) {}

  create(adminFeesPrice: AdminFeesPrice): Observable<HttpResponse<AdminFeesPrice>> {
    return this.http.post<AdminFeesPrice>(this.resourceUrl, adminFeesPrice, { observe: 'response' });
  }

  update(adminFeesPrice: AdminFeesPrice): Observable<HttpResponse<AdminFeesPrice>> {
    return this.http.put(`${this.resourceUrl}/${adminFeesPrice.id}`, adminFeesPrice, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<AdminFeesPrice>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<AdminFeesPrice[]>> {
    const options = createRequestOption(req);
    return this.http.get<AdminFeesPrice[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
