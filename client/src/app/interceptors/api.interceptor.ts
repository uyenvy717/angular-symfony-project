import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const ApiInterceptor: HttpInterceptorFn = (req, next) => {
  // Clone the request and add headers
  const modifiedRequest = req.clone({
    headers: req.headers
      .set('Content-Type', 'application/json')
      // Add any other headers you need
  });

  return next(modifiedRequest).pipe(
    catchError((error) => {
      // Handle different types of errors
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        console.error('An error occurred:', error.error.message);
        return throwError(() => new Error('Something went wrong on the client side'));
      } else {
        // Server-side error
        console.error(`Backend returned code ${error.status}, body was:`, error.error);
        return throwError(() => new Error('Something went wrong on the server side'));
      }
    })
  );
}; 