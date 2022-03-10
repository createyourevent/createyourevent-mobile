import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ProductComment } from './product-comment.model';

@Injectable({ providedIn: 'root' })
export class ProductCommentService {
  private resourceUrl = ApiService.API_URL + '/product-comments';

  constructor(protected http: HttpClient) {}

  create(productComment: ProductComment): Observable<HttpResponse<ProductComment>> {
    return this.http.post<ProductComment>(this.resourceUrl, productComment, { observe: 'response' });
  }

  update(productComment: ProductComment): Observable<HttpResponse<ProductComment>> {
    return this.http.put(`${this.resourceUrl}/${productComment.id}`, productComment, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ProductComment>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ProductComment[]>> {
    const options = createRequestOption(req);
    return this.http.get<ProductComment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
