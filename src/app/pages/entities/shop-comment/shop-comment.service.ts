import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ShopComment } from './shop-comment.model';

@Injectable({ providedIn: 'root' })
export class ShopCommentService {
  private resourceUrl = ApiService.API_URL + '/shop-comments';

  constructor(protected http: HttpClient) {}

  create(shopComment: ShopComment): Observable<HttpResponse<ShopComment>> {
    return this.http.post<ShopComment>(this.resourceUrl, shopComment, { observe: 'response' });
  }

  update(shopComment: ShopComment): Observable<HttpResponse<ShopComment>> {
    return this.http.put(`${this.resourceUrl}/${shopComment.id}`, shopComment, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ShopComment>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ShopComment[]>> {
    const options = createRequestOption(req);
    return this.http.get<ShopComment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
