import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(credentials: {
    password: string;
    email: string;
  }): Observable<LoginResponse> {
    return this.http
      // .post<LoginResponse>(`${this.apiUrl}/auth`, credentials)
      .post<LoginResponse>(`http://localhost:8000/auth`, credentials)
      .pipe(
        tap((response) => {
          // Store the token in localStorage
          localStorage.setItem(this.tokenKey, response.token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
} 