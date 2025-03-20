import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PartnerComponent } from './partner/partner.component';
import { ClientComponent } from './client/client.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'partner',
    component: PartnerComponent,
  },
  {
    path: 'client',
    component: ClientComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule {}