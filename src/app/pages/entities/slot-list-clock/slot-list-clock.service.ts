import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { SlotListClock } from './slot-list-clock.model';

@Injectable({ providedIn: 'root' })
export class SlotListClockService {
  private resourceUrl = ApiService.API_URL + '/slot-list-clocks';

  constructor(protected http: HttpClient) {}

  create(slotListClock: SlotListClock): Observable<HttpResponse<SlotListClock>> {
    return this.http.post<SlotListClock>(this.resourceUrl, slotListClock, { observe: 'response' });
  }

  update(slotListClock: SlotListClock): Observable<HttpResponse<SlotListClock>> {
    return this.http.put(`${this.resourceUrl}/${slotListClock.id}`, slotListClock, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<SlotListClock>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<SlotListClock[]>> {
    const options = createRequestOption(req);
    return this.http.get<SlotListClock[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
