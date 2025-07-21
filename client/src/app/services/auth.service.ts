import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { PartnerTypeEnum } from './partner.service';
import { OptionsService } from './options.service';

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
  username: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private optionService = inject(OptionsService);
  private apiUrl = environment.authUrl;
  private tokenKey = 'auth_token';
  private tokenInfo = signal<TokenPayload | null>(null);
  isGrowthPartner = computed(() =>  this.tokenInfo()?.partner?.type?.includes(PartnerTypeEnum.GROWTH));
  
  private userRoles = computed(() => this.tokenInfo()?.roles);
  isSuperAdmin = computed(() =>  this.userRoles()?.includes('ROLE_SUPER_ADMIN'));
  isNotAdmin = computed(() => this.userRoles()?.toString() === ['ROLE_USER'].toString());

  constructor(private http: HttpClient) {
    // Initialize roles from token if it exists
    this.initializeAccount();
  }

  private initializeAccount() {
    this.tokenInfo.set(this.getDecodedToken());
    this.optionService.setRole(this.userRoles()?.[0] ?? '');
    const isExpired = this.isTokenExpired(this.tokenInfo());
    if (isExpired) {
      this.logout();
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
          // The response is token
          // Store the token in localStorage
          localStorage.setItem(this.tokenKey, response.token);
          // Initialize account from token
          this.initializeAccount();
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.tokenInfo.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getName = computed(() => this.tokenInfo()?.name);
  getPartnerId = computed(() => this.tokenInfo()?.partner?.id as string);
} 
