import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Project, ProjectStatus } from '../core/project.model';
import { ProjectService } from '../core/project.service';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { Direction } from '@angular/cdk/bidi';
import { TeamService } from 'app/services/team.service';
import { Team } from 'app/models/TeamAdapter';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  public lists: object;
  public listsTeam: object;
  private pollingInterval: any;

  constructor(
    private projectService: ProjectService,
    private teamservice: TeamService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.lists = {};
    this.listsTeam = {};
  }

  public ngOnInit(): void {
    this.projectService.getObjects().subscribe((projects: Project[]) => {
      // split project to status categories
      this.lists = {projects};
    });

    this.pollingInterval = setInterval(() => {
      this.refreshTeams();
    }, 5000);
  }
  getUsersLength(team: Team): number {
    return team.userList?.length??0;
  }
  refreshTeams() {
    this.teamservice.getObjects().subscribe((teams: Team[]) => {
      // split project to status categories
      this.listsTeam = {teams};
    });
  }
  unsorted = (): number => {
    return 0;
  };
  public drop(event: CdkDragDrop<any>): void {
    if (event.previousContainer !== event.container) {
      const project = event.item.data;
      this.projectService.updateObject(project);
    }
  }

  public addProject(name: string, status: any): void {
    this.projectService.createOject({
      name,
      status: ProjectStatus[status],
    });
  }

  public removeProject(project: Project): void {
    // show "deleted" info
    // const snack = this.snackBar.open("The Project has been deleted", "Undo");
    const snack = this.snackBar.open(
      'Project deleted Successfully...!!!',
      'Undo',
      {
        duration: 4000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'snackbar-danger',
      }
    );
    // put project to the trash
    this.projectService.detachObject(project);
    // when snack has been removed (dismissed)
    snack.afterDismissed().subscribe((info) => {
      if (info.dismissedByAction !== true) {
        // if dismissed not by undo click (so it dissappeared)
        // then get project by id and delete it
        this.projectService.deleteObject(project);
      }
    });
    // snack action has been taken
    snack.onAction().subscribe(() => {
      // undo button clicked, so remove project from the trash
      this.projectService.attachObject(project);
    });
  }

  public newProjectDialog(): void {
    this.dialogOpen('Créer une nouvelle équipe', null);
  }

  public editProjectDialog(team: Team): void {
    this.dialogOpen('Modifier Equipe', team);
  }

  private dialogOpen(title: string, project: Team | any): void {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    // open angular material dialog
    this.dialog.open(ProjectDialogComponent, {
      height: '85%',
      width: '55%',
      autoFocus: true,
      data: {
        title,
        project,
      },
      direction: tempDirection,
    });
  }
}
