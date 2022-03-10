import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Cart } from './cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private resourceUrl = ApiService.API_URL + '/carts';

  constructor(protected http: HttpClient) {}

  create(cart: Cart): Observable<HttpResponse<Cart>> {
    return this.http.post<Cart>(this.resourceUrl, cart, { observe: 'response' });
  }

  update(cart: Cart): Observable<HttpResponse<Cart>> {
    return this.http.put(`${this.resourceUrl}/${cart.id}`, cart, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Cart>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Cart[]>> {
    const options = createRequestOption(req);
    return this.http.get<Cart[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
