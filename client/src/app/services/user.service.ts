import { Injectable } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.userUrl;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    // TODO use httpResource instead
    // const httpClients = httpResource(this.apiUrl);
    return this.http.get(this.apiUrl).pipe(
      tap(response => {
        console.log('Users API Response:', response);
      })
    );
  }

  // Get user by id
  getUser(id: string): Observable<any> {
    return this.http.get(this.apiUrl + '/' + id).pipe(
      tap(response => {
        console.log('User API Response:', response);
      })
    )
  }

  // Get users by registered partner
  getUsersByPartner(id: string): Observable<any> {
    return this.http.get(this.apiUrl + '/by_registered_partner/' + id).pipe(
      tap(response => {
        console.log('Users API Response:', response);
      })
    )
  }
}