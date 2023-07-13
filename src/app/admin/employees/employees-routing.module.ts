import { NgModule } from "@angular/core";
import { EmployeesComponent } from "./all-employees/all-employees.component";
import { Routes, RouterModule } from "@angular/router";
const routes: Routes = [
  {
    path: "allemployees",
    component: EmployeesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
