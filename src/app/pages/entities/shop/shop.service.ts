import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Shop } from './shop.model';

@Injectable({ providedIn: 'root' })
export class ShopService {
  private resourceUrl = ApiService.API_URL + '/shops';

  constructor(protected http: HttpClient) {}

  create(shop: Shop): Observable<HttpResponse<Shop>> {
    return this.http.post<Shop>(this.resourceUrl, shop, { observe: 'response' });
  }

  update(shop: Shop): Observable<HttpResponse<Shop>> {
    return this.http.put(`${this.resourceUrl}/${shop.id}`, shop, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Shop>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Shop[]>> {
    const options = createRequestOption(req);
    return this.http.get<Shop[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
