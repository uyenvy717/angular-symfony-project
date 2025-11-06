import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InsideDashboardComponent } from './inside-dashboard/inside-dashboard.component';

const routes: Routes = [
  { path: 'inside-dashboard', component: InsideDashboardComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}