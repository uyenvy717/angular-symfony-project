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
  private apiUrl = environment.authUrl;
  private tokenKey = 'auth_token';
  constructor(private http: HttpClient) {
    // Initialize roles from token if it exists
    this.initializeRoles();
  }

  private initializeRoles() {
    this.tokenInfo = this.getDecodedToken();
    if (this.tokenInfo && this.tokenInfo.roles) {
      this.userRoles = this.tokenInfo.roles;
      console.log('Initialized user roles:', this.userRoles);
    }
  }


  // Decode and get token payload
  getDecodedToken(): TokenPayload | null {
    const token = this.getToken();
    if (!token) {
      console.log('No token found');
      return null;
    }

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      console.log('Decoded token payload:', decodedPayload);
      return decodedPayload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Check if token is expired
  // isTokenExpired(): boolean {
  //   const decodedToken = this.getDecodedToken();
  //   if (!decodedToken) return true;
  //
  //   const currentTime = Date.now() / 1000;
  //   return decodedToken.exp < currentTime;
  // }

  login(credentials: {
    password: string;
    email: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}`, credentials)
      .pipe(
        tap((response) => {
          console.log('User info:', response);
          console.log('Token received:', response.token ? 'Yes' : 'No');
          // Store the token in localStorage
          localStorage.setItem(this.tokenKey, response.token);
          // Initialize roles from token
          this.initializeRoles();
          // Log decoded token information
          this.tokenInfo = this.getDecodedToken();
          if (this.tokenInfo) {
            console.log('Token expiration:', new Date(this.tokenInfo.exp * 1000));
            console.log('User roles:', this.userRoles);
          }
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
