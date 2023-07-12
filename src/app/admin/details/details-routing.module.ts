import { NgModule } from "@angular/core";
import { EmployeesComponent } from "./employees/employees.component";
import { Routes, RouterModule } from "@angular/router";
import { AllteamsComponent } from "./all-teams/all-teams.component";
const routes: Routes = [
  {
    path: "allteams",
    component: AllteamsComponent,
  },
  {
    path: "allemployees",
    component: EmployeesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsRoutingModule {}
