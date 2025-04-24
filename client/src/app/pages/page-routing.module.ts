import { RouterModule, Routes } from '@angular/router';
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
          partner: () => inject(PartnerService).getSelectedPartner(),
        },
      },
      {
        path: ':id/:subId',
        component: InsideDashboardComponent,
        resolve: {
          partner: () => inject(PartnerService).getSelectedPartner(),
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
          client: () => inject(ClientService).getSelectedClient(),
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
          user: () => inject(UserService).getSelectedUser(),
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