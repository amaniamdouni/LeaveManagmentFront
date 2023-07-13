import { TruncatePipe, PluralPipe } from './all-teams/core/pipes';
import { TeamDialogComponent } from './all-teams/team-dialog/team-dialog.component';
import { BoardComponent } from './all-teams/board/board.component';
import { AllteamsComponent } from './all-teams/all-teams.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TeamsRoutingModule } from './teams-routing.module';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { UserDialogComponent } from './all-teams/user-dialog/user-dialog.component';



@NgModule({
  declarations: [
    AllteamsComponent,
    BoardComponent,
    TeamDialogComponent,
    UserDialogComponent,
    TruncatePipe,
    PluralPipe,
  ],
  imports: [
    CommonModule,
    TeamsRoutingModule,
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
export class TeamsModule {}
