import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { SlotListPlum } from './slot-list-plum.model';

@Injectable({ providedIn: 'root' })
export class SlotListPlumService {
  private resourceUrl = ApiService.API_URL + '/slot-list-plums';

  constructor(protected http: HttpClient) {}

  create(slotListPlum: SlotListPlum): Observable<HttpResponse<SlotListPlum>> {
    return this.http.post<SlotListPlum>(this.resourceUrl, slotListPlum, { observe: 'response' });
  }

  update(slotListPlum: SlotListPlum): Observable<HttpResponse<SlotListPlum>> {
    return this.http.put(`${this.resourceUrl}/${slotListPlum.id}`, slotListPlum, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<SlotListPlum>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<SlotListPlum[]>> {
    const options = createRequestOption(req);
    return this.http.get<SlotListPlum[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
