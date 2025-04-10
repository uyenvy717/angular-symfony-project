import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export type PartnerType = 'growth' | 'solution' | 'provider' | 'affiliate';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private apiUrls = environment.partnerUrls;

  constructor(private http: HttpClient) { }

  // Get partners by type
  getPartners(type: PartnerType): Observable<any> {
    console.log(`Fetching ${type} partners from:`, this.apiUrls[type]);
    return this.http.get(this.apiUrls[type]).pipe(
      tap(response => {
        console.log(`${type} Partners API Response:`, response);
      })
    );
  }

  // Get partner by id
  getPartner(type: PartnerType, id: string): Observable<any> {
    return this.http.get(this.apiUrls[type] + '/' + id).pipe(
      tap(response => {
        console.log(`${type} Partner API Response:`, response);
      })
    )
  }

  // Get partners by registered partner
  getByRegisteredPartner(type: PartnerType, id: string): Observable<any> {
    return this.http.get(this.apiUrls[type] + '/by_registered_partner/' + id).pipe(
      tap(response => {
        console.log(`${type} Partners API Response:`, response);
      })
    )
  }
} 