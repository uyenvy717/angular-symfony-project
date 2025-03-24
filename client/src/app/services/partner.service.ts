import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private apiUrl = environment.growthPartnerApiUrl;

  constructor(private http: HttpClient) { }

  // Get all partners
  getPartners(): Observable<any> {
    console.log('Fetching partners from:', this.apiUrl);
    return this.http.get(`${this.apiUrl}`).pipe(
      tap(response => {
        console.log('Partners API Response:', response);
      })
    );
  }

  // Get partner by ID
  getPartnerById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Create new partner
  createPartner(partnerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, partnerData);
  }

  // Update partner
  updatePartner(id: string, partnerData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, partnerData);
  }

  // Delete partner
  deletePartner(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 