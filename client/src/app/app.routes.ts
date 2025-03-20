import { Route } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('./pages/page.module').then(m => m.PageModule),
  }
];
