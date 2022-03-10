import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { UserPointAssociation } from './user-point-association.model';

@Injectable({ providedIn: 'root' })
export class UserPointAssociationService {
  private resourceUrl = ApiService.API_URL + '/user-point-associations';

  constructor(protected http: HttpClient) {}

  create(userPointAssociation: UserPointAssociation): Observable<HttpResponse<UserPointAssociation>> {
    return this.http.post<UserPointAssociation>(this.resourceUrl, userPointAssociation, { observe: 'response' });
  }

  update(userPointAssociation: UserPointAssociation): Observable<HttpResponse<UserPointAssociation>> {
    return this.http.put(`${this.resourceUrl}/${userPointAssociation.id}`, userPointAssociation, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<UserPointAssociation>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<UserPointAssociation[]>> {
    const options = createRequestOption(req);
    return this.http.get<UserPointAssociation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
