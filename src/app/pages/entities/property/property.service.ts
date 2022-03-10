import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Property } from './property.model';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private resourceUrl = ApiService.API_URL + '/properties';

  constructor(protected http: HttpClient) {}

  create(property: Property): Observable<HttpResponse<Property>> {
    return this.http.post<Property>(this.resourceUrl, property, { observe: 'response' });
  }

  update(property: Property): Observable<HttpResponse<Property>> {
    return this.http.put(`${this.resourceUrl}/${property.id}`, property, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Property>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Property[]>> {
    const options = createRequestOption(req);
    return this.http.get<Property[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
