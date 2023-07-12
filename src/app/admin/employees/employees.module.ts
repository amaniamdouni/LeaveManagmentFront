

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormDialogComponent } from './all-employees/dialog/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './all-employees/dialog/delete/delete.component';

import { EmployeesRoutingModule } from './employees-routing.module';
import { ComponentsModule } from '@shared/components/components.module';
import { EmployeesComponent } from './all-employees/all-employees.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [
    EmployeesComponent,
    FormDialogComponent,
    DeleteDialogComponent,
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
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
export class EmployeesModule {}
