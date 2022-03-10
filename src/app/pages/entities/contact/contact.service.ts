import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Contact } from './contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private resourceUrl = ApiService.API_URL + '/contacts';

  constructor(protected http: HttpClient) {}

  create(contact: Contact): Observable<HttpResponse<Contact>> {
    return this.http.post<Contact>(this.resourceUrl, contact, { observe: 'response' });
  }

  update(contact: Contact): Observable<HttpResponse<Contact>> {
    return this.http.put(`${this.resourceUrl}/${contact.id}`, contact, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Contact>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Contact[]>> {
    const options = createRequestOption(req);
    return this.http.get<Contact[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
