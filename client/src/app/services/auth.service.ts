import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
}

interface TokenPayload {
  exp: number;
  iat: number;
  name: string;
  partner: {
    id: string;
    type: string;
  };
  email: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.authUrl;
  private tokenKey = 'auth_token';
  private userRoles = signal<string[]>([]);
  private user = signal<{ userRoles: [], userName: string, email: string, lastLoginDate: string } | null >(null);
  private tokenInfo!: TokenPayload | null;

  constructor(private http: HttpClient, private router: Router) {
    // Initialize roles from token if it exists
    this.initializeRoles();
  }

  private initializeRoles() {
    this.tokenInfo = this.getDecodedToken();
    const isExpired = this.isTokenExpired(this.tokenInfo);
    if (isExpired) {
      this.logout();
    } else if (this.tokenInfo && this.tokenInfo.roles) {
      this.userRoles.set(this.tokenInfo.roles);
    }
  }

  isSuperAdmin = computed(() =>  this.userRoles().includes('ROLE_SUPER_ADMIN'))

  // Check if user has a specific role
  hasRole(role: string): boolean {
    return this.userRoles().includes(role);
  }

  // Check if user's partner type is GrowthPartner
  isGrowthPartner(): boolean {
    return !!this.tokenInfo?.partner?.type?.includes('GrowthPartner');
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
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired(decodedToken: TokenPayload | null): boolean {
    if (!decodedToken) return true;

    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  }

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
    this.userRoles.set([]);
    this.tokenInfo = null;
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
} 
