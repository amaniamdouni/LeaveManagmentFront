import { NgModule } from "@angular/core";
import { EstimatesComponent } from "./estimates/estimates.component";
import { ProjectDetailsComponent } from "./project-details/project-details.component";
import { Routes, RouterModule } from "@angular/router";
import { AddprojectsComponent } from "./add-project/add-project.component";
import { AllprojectsComponent } from "./all-projects/all-projects.component";
const routes: Routes = [
  {
    path: "addProject",
    component: AddprojectsComponent,
  },
  {
    path: "teams",
    component: AllprojectsComponent,
  },
  {
    path: "employees",
    component: EstimatesComponent,
  },
  {
    path: "projectDetails",
    component: ProjectDetailsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
