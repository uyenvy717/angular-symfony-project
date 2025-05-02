import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { inject, NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/main-dashboard/dashboard.component';
import { PartnerComponent } from './partner/partner.component';
import { ClientComponent } from './client/client.component';
import { UserComponent } from './user/user.component';
import { InsideDashboardComponent } from './dashboard/inside-dashboard/inside-dashboard.component';
import { PartnerService } from '../services/partner.service';
import { ClientService } from '../services/client.service';
import { UserService } from '../services/user.service';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'partners',
    children: [
      {
        path: '',
        component: PartnerComponent,
      },
      {
        path: ':id',
        component: InsideDashboardComponent,
        resolve: {
          partner: (
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
          ) => {
            const service = inject(PartnerService);
            const id = route.params['id'];
            const partner = service.getPartnerById(id);
            if (partner) {
              return partner;
            }
            return service.fetchPartner(id);
          },
        },
      },
    ],
  },
  {
    path: 'clients',
    children: [
      {
        path: '',
        component: ClientComponent,
      },
      {
        path: ':id',
        component: InsideDashboardComponent,
        resolve: {
          client: (
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
          ) => {
            const service = inject(ClientService);
            const id = route.params['id'];
            const client = service.getClientById(id);
            if (client) {
              return client;
            }
            return service.fetchClient(id);
          },
        },
      },
    ],
  },
  {
    path: 'users',
    children: [
      {
        path: '',
        component: UserComponent,
      },
      {
        path: ':id',
        component: InsideDashboardComponent,
        resolve: {
          user: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
            const service = inject(UserService);
            const id = route.params['id'];
            const user = service.getUserById(id);
            if (user) {
              return user;
            }
            return service.fetchUser(id);
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule {}