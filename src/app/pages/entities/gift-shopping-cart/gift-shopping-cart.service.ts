import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { GiftShoppingCart } from './gift-shopping-cart.model';

@Injectable({ providedIn: 'root' })
export class GiftShoppingCartService {
  private resourceUrl = ApiService.API_URL + '/gift-shopping-carts';

  constructor(protected http: HttpClient) {}

  create(giftShoppingCart: GiftShoppingCart): Observable<HttpResponse<GiftShoppingCart>> {
    return this.http.post<GiftShoppingCart>(this.resourceUrl, giftShoppingCart, { observe: 'response' });
  }

  update(giftShoppingCart: GiftShoppingCart): Observable<HttpResponse<GiftShoppingCart>> {
    return this.http.put(`${this.resourceUrl}/${giftShoppingCart.id}`, giftShoppingCart, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<GiftShoppingCart>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<GiftShoppingCart[]>> {
    const options = createRequestOption(req);
    return this.http.get<GiftShoppingCart[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
