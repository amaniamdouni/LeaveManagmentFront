import { NgModule } from "@angular/core";
import { EstimatesComponent } from "./estimates/estimates.component";
import { Routes, RouterModule } from "@angular/router";
import { AllteamsComponent } from "./all-projects/all-teams.component";
const routes: Routes = [
  {
    path: "allprojects",
    component: AllteamsComponent,
  },
  {
    path: "estimates",
    component: EstimatesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
