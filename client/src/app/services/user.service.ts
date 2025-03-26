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
        console.log('Clients API Response:', response);
      })
    );
  }
}