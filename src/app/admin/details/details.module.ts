import { TruncatePipe, PluralPipe } from './all-teams/core/pipes';
import { TeamDialogComponent } from './all-teams/team-dialog/team-dialog.component';
import { BoardComponent } from './all-teams/board/board.component';
import { AllteamsComponent } from './all-teams/all-teams.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormDialogComponent } from './employees/dialog/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './employees/dialog/delete/delete.component';

import { DetailsRoutingModule } from './details-routing.module';
import { ComponentsModule } from '@shared/components/components.module';
import { EmployeesComponent } from './employees/employees.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [
    AllteamsComponent,
    BoardComponent,
    TeamDialogComponent,
    TruncatePipe,
    PluralPipe,
    EmployeesComponent,
    FormDialogComponent,
    DeleteDialogComponent,
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    CKEditorModule,
    ComponentsModule,
    SharedModule,
  ],
  providers: [],
})
export class DetailsModule {}
