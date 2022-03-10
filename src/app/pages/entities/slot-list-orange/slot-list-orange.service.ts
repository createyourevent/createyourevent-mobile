import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { SlotListOrange } from './slot-list-orange.model';

@Injectable({ providedIn: 'root' })
export class SlotListOrangeService {
  private resourceUrl = ApiService.API_URL + '/slot-list-oranges';

  constructor(protected http: HttpClient) {}

  create(slotListOrange: SlotListOrange): Observable<HttpResponse<SlotListOrange>> {
    return this.http.post<SlotListOrange>(this.resourceUrl, slotListOrange, { observe: 'response' });
  }

  update(slotListOrange: SlotListOrange): Observable<HttpResponse<SlotListOrange>> {
    return this.http.put(`${this.resourceUrl}/${slotListOrange.id}`, slotListOrange, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<SlotListOrange>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<SlotListOrange[]>> {
    const options = createRequestOption(req);
    return this.http.get<SlotListOrange[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
