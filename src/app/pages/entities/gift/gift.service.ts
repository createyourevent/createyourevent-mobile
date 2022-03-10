import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Gift } from './gift.model';

@Injectable({ providedIn: 'root' })
export class GiftService {
  private resourceUrl = ApiService.API_URL + '/gifts';

  constructor(protected http: HttpClient) {}

  create(gift: Gift): Observable<HttpResponse<Gift>> {
    return this.http.post<Gift>(this.resourceUrl, gift, { observe: 'response' });
  }

  update(gift: Gift): Observable<HttpResponse<Gift>> {
    return this.http.put(`${this.resourceUrl}/${gift.id}`, gift, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Gift>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Gift[]>> {
    const options = createRequestOption(req);
    return this.http.get<Gift[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
