import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { CreateYourEventService } from './create-your-event-service.model';

@Injectable({ providedIn: 'root' })
export class CreateYourEventServiceService {
  private resourceUrl = ApiService.API_URL + '/create-your-event-services';

  constructor(protected http: HttpClient) {}

  create(createYourEventService: CreateYourEventService): Observable<HttpResponse<CreateYourEventService>> {
    return this.http.post<CreateYourEventService>(this.resourceUrl, createYourEventService, { observe: 'response' });
  }

  update(createYourEventService: CreateYourEventService): Observable<HttpResponse<CreateYourEventService>> {
    return this.http.put(`${this.resourceUrl}/${createYourEventService.id}`, createYourEventService, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<CreateYourEventService>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<CreateYourEventService[]>> {
    const options = createRequestOption(req);
    return this.http.get<CreateYourEventService[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
