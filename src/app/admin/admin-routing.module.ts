import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'teams',
    loadChildren: () =>
      import('./teams/teams.module').then((m) => m.TeamsModule),
  },
   {
    path: 'employee',
    loadChildren: () =>
      import('./employees/employees.module').then((m) => m.EmployeesModule),
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
