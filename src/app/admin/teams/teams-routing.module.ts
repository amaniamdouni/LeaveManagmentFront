import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AllteamsComponent } from "./all-teams/all-teams.component";
const routes: Routes = [
  {
    path: "allteams",
    component: AllteamsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule {}
