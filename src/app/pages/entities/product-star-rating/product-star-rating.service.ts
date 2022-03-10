import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ProductStarRating } from './product-star-rating.model';

@Injectable({ providedIn: 'root' })
export class ProductStarRatingService {
  private resourceUrl = ApiService.API_URL + '/product-star-ratings';

  constructor(protected http: HttpClient) {}

  create(productStarRating: ProductStarRating): Observable<HttpResponse<ProductStarRating>> {
    return this.http.post<ProductStarRating>(this.resourceUrl, productStarRating, { observe: 'response' });
  }

  update(productStarRating: ProductStarRating): Observable<HttpResponse<ProductStarRating>> {
    return this.http.put(`${this.resourceUrl}/${productStarRating.id}`, productStarRating, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ProductStarRating>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ProductStarRating[]>> {
    const options = createRequestOption(req);
    return this.http.get<ProductStarRating[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
