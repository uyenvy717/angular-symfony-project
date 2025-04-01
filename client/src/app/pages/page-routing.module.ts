import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/main-dashboard/dashboard.component';
import { PartnerComponent } from './partner/partner.component';
import { ClientComponent } from './client/client.component';
import { UserComponent } from './user/user.component';
import { InsideDashboardComponent } from './dashboard/inside-dashboard/inside-dashboard.component';


// clients/id
// clients/id/users
// clients/id/dashboard



// contracts
// contracts/active
// contracts/inactive

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    // loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'partners',
    component: PartnerComponent,
  },
  {
    path: 'clients',
    component: ClientComponent,
  },
  {
    path: 'client/:id',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UserComponent }
    ]
  },
  {
    path: 'users',
    component: UserComponent,
  },
  {
    path: 'detail',
    component: InsideDashboardComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule {}