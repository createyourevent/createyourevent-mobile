import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ShopLikeDislike } from './shop-like-dislike.model';

@Injectable({ providedIn: 'root' })
export class ShopLikeDislikeService {
  private resourceUrl = ApiService.API_URL + '/shop-like-dislikes';

  constructor(protected http: HttpClient) {}

  create(shopLikeDislike: ShopLikeDislike): Observable<HttpResponse<ShopLikeDislike>> {
    return this.http.post<ShopLikeDislike>(this.resourceUrl, shopLikeDislike, { observe: 'response' });
  }

  update(shopLikeDislike: ShopLikeDislike): Observable<HttpResponse<ShopLikeDislike>> {
    return this.http.put(`${this.resourceUrl}/${shopLikeDislike.id}`, shopLikeDislike, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ShopLikeDislike>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ShopLikeDislike[]>> {
    const options = createRequestOption(req);
    return this.http.get<ShopLikeDislike[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
