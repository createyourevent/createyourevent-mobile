import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { SlotListCherry } from './slot-list-cherry.model';

@Injectable({ providedIn: 'root' })
export class SlotListCherryService {
  private resourceUrl = ApiService.API_URL + '/slot-list-cherries';

  constructor(protected http: HttpClient) {}

  create(slotListCherry: SlotListCherry): Observable<HttpResponse<SlotListCherry>> {
    return this.http.post<SlotListCherry>(this.resourceUrl, slotListCherry, { observe: 'response' });
  }

  update(slotListCherry: SlotListCherry): Observable<HttpResponse<SlotListCherry>> {
    return this.http.put(`${this.resourceUrl}/${slotListCherry.id}`, slotListCherry, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<SlotListCherry>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<SlotListCherry[]>> {
    const options = createRequestOption(req);
    return this.http.get<SlotListCherry[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
