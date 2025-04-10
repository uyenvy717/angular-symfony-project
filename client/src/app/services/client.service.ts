import { Injectable } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = environment.clientUrl;

  constructor(private http: HttpClient) { }

  getClients(): Observable<any> {
    // TODO use httpResource instead
    // const httpClients = httpResource(this.apiUrl);
    return this.http.get(this.apiUrl).pipe(
      tap(response => {
        console.log('Clients API Response:', response);
      })
    );
  }

  // Get client by id
  getClient(id: string): Observable<any> {
    return this.http.get(this.apiUrl + '/' + id).pipe(
      tap(response => {
        console.log('Client API Response:', response);
      })
    )
  }

  // Get client by registered partner
  getClientsByPartner(id: string): Observable<any> {
    return this.http.get(this.apiUrl + '/by_registered_partner/' + id).pipe(
      tap(response => {
        console.log('Clients API Response:', response);
      })
    )
  }
}