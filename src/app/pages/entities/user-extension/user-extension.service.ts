import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { UserExtension } from './user-extension.model';

@Injectable({ providedIn: 'root' })
export class UserExtensionService {
  private resourceUrl = ApiService.API_URL + '/user-extensions';

  constructor(protected http: HttpClient) {}

  create(userExtension: UserExtension): Observable<HttpResponse<UserExtension>> {
    return this.http.post<UserExtension>(this.resourceUrl, userExtension, { observe: 'response' });
  }

  update(userExtension: UserExtension): Observable<HttpResponse<UserExtension>> {
    return this.http.put(`${this.resourceUrl}/${userExtension.id}`, userExtension, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<UserExtension>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<UserExtension[]>> {
    const options = createRequestOption(req);
    return this.http.get<UserExtension[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
