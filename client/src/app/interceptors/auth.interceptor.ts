import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Skip token validation for login endpoint
  if (req.url === environment.authUrl) {
    return next(req);
  }
  
  // Check if token is expired before making the request
  const tokenInfo = authService.getDecodedToken();
  if (authService.isTokenExpired(tokenInfo)) {
    authService.logout();
    return throwError(() => new Error('Token expired'));
  }

  // Get the token
  const token = authService.getToken();
  
  // Clone the request and add the authorization header
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle the request and catch any errors
  return next(req).pipe(
    catchError((error) => {
      // If the error is 401 (Unauthorized), logout the user
      if (error.status === 401) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
}; 