import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Hotel } from './hotel.model';

@Injectable({ providedIn: 'root' })
export class HotelService {
  private resourceUrl = ApiService.API_URL + '/hotels';

  constructor(protected http: HttpClient) {}

  create(hotel: Hotel): Observable<HttpResponse<Hotel>> {
    return this.http.post<Hotel>(this.resourceUrl, hotel, { observe: 'response' });
  }

  update(hotel: Hotel): Observable<HttpResponse<Hotel>> {
    return this.http.put(`${this.resourceUrl}/${hotel.id}`, hotel, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Hotel>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Hotel[]>> {
    const options = createRequestOption(req);
    return this.http.get<Hotel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
