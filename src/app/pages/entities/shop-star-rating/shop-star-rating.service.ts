import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ShopStarRating } from './shop-star-rating.model';

@Injectable({ providedIn: 'root' })
export class ShopStarRatingService {
  private resourceUrl = ApiService.API_URL + '/shop-star-ratings';

  constructor(protected http: HttpClient) {}

  create(shopStarRating: ShopStarRating): Observable<HttpResponse<ShopStarRating>> {
    return this.http.post<ShopStarRating>(this.resourceUrl, shopStarRating, { observe: 'response' });
  }

  update(shopStarRating: ShopStarRating): Observable<HttpResponse<ShopStarRating>> {
    return this.http.put(`${this.resourceUrl}/${shopStarRating.id}`, shopStarRating, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ShopStarRating>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ShopStarRating[]>> {
    const options = createRequestOption(req);
    return this.http.get<ShopStarRating[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
