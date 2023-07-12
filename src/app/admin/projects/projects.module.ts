import { TruncatePipe, PluralPipe } from './all-teams/core/pipes';
import { TeamDialogComponent } from './all-teams/team-dialog/team-dialog.component';
import { BoardComponent } from './all-teams/board/board.component';
import { AllteamsComponent } from './all-teams/all-teams.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormDialogComponent } from './estimates/dialog/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './estimates/dialog/delete/delete.component';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ComponentsModule } from '@shared/components/components.module';
import { EstimatesComponent } from './estimates/estimates.component';
import { SharedModule } from '@shared';
import { EstimatesService } from './estimates/estimates.service';

@NgModule({
  declarations: [
    AllteamsComponent,
    BoardComponent,
    TeamDialogComponent,
    TruncatePipe,
    PluralPipe,
    EstimatesComponent,
    FormDialogComponent,
    DeleteDialogComponent,
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    CKEditorModule,
    ComponentsModule,
    SharedModule,
  ],
  providers: [EstimatesService],
})
export class ProjectsModule {}
