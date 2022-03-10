import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Coupon } from './coupon.model';

@Injectable({ providedIn: 'root' })
export class CouponService {
  private resourceUrl = ApiService.API_URL + '/coupons';

  constructor(protected http: HttpClient) {}

  create(coupon: Coupon): Observable<HttpResponse<Coupon>> {
    return this.http.post<Coupon>(this.resourceUrl, coupon, { observe: 'response' });
  }

  update(coupon: Coupon): Observable<HttpResponse<Coupon>> {
    return this.http.put(`${this.resourceUrl}/${coupon.id}`, coupon, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Coupon>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Coupon[]>> {
    const options = createRequestOption(req);
    return this.http.get<Coupon[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
