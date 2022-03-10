import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ProductLikeDislike } from './product-like-dislike.model';

@Injectable({ providedIn: 'root' })
export class ProductLikeDislikeService {
  private resourceUrl = ApiService.API_URL + '/product-like-dislikes';

  constructor(protected http: HttpClient) {}

  create(productLikeDislike: ProductLikeDislike): Observable<HttpResponse<ProductLikeDislike>> {
    return this.http.post<ProductLikeDislike>(this.resourceUrl, productLikeDislike, { observe: 'response' });
  }

  update(productLikeDislike: ProductLikeDislike): Observable<HttpResponse<ProductLikeDislike>> {
    return this.http.put(`${this.resourceUrl}/${productLikeDislike.id}`, productLikeDislike, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ProductLikeDislike>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ProductLikeDislike[]>> {
    const options = createRequestOption(req);
    return this.http.get<ProductLikeDislike[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
