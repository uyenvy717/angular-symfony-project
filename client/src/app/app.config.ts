import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApiInterceptor } from './interceptors/api.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { environment } from '../environments/environment';
import { ApiModule } from './api/api.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      appRoutes
      // withDebugTracing(),
      // withRouterConfig({ onSameUrlNavigation: 'reload'})
    ),
    provideAnimations(),
    provideHttpClient(withInterceptors([AuthInterceptor, ApiInterceptor])),
    importProvidersFrom([ApiModule.forRoot({ rootUrl: environment.apiUrl })]),
  ],
};
