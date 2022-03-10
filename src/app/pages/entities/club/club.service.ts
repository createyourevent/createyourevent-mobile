import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Club } from './club.model';

@Injectable({ providedIn: 'root' })
export class ClubService {
  private resourceUrl = ApiService.API_URL + '/clubs';

  constructor(protected http: HttpClient) {}

  create(club: Club): Observable<HttpResponse<Club>> {
    return this.http.post<Club>(this.resourceUrl, club, { observe: 'response' });
  }

  update(club: Club): Observable<HttpResponse<Club>> {
    return this.http.put(`${this.resourceUrl}/${club.id}`, club, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Club>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Club[]>> {
    const options = createRequestOption(req);
    return this.http.get<Club[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
