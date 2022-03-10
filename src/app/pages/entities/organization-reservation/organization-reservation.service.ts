import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { OrganizationReservation } from './organization-reservation.model';

@Injectable({ providedIn: 'root' })
export class OrganizationReservationService {
  private resourceUrl = ApiService.API_URL + '/organization-reservations';

  constructor(protected http: HttpClient) {}

  create(organizationReservation: OrganizationReservation): Observable<HttpResponse<OrganizationReservation>> {
    return this.http.post<OrganizationReservation>(this.resourceUrl, organizationReservation, { observe: 'response' });
  }

  update(organizationReservation: OrganizationReservation): Observable<HttpResponse<OrganizationReservation>> {
    return this.http.put(`${this.resourceUrl}/${organizationReservation.id}`, organizationReservation, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<OrganizationReservation>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<OrganizationReservation[]>> {
    const options = createRequestOption(req);
    return this.http.get<OrganizationReservation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
