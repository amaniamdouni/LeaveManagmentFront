import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TeamDialogComponent } from '../team-dialog/team-dialog.component';
import { Direction } from '@angular/cdk/bidi';
import { TeamService } from 'app/services/team.service';
import { Team } from 'app/models/TeamAdapter';
import { EmployeesComponent } from 'app/admin/employees/all-employees/all-employees.component';
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
    private teamservice: TeamService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.lists = {};
    this.listsTeam = {};
  }

  async ngOnInit() {
    this.teamservice.getObjects().subscribe((teams: Team[]) => {
      // split project to status categories
      this.lists = {teams};
    });
      this.refreshTeams();

    // this.pollingInterval = setInterval(() => {
    //   this.refreshTeams();
    // }, 5000);
  }
  getUsersLength(team: Team): number {
    return team.userList?.length??0;
  }
  async refreshTeams() {
    this.teamservice.getObjects().subscribe((teams: Team[]) => {
      // split project to status categories
      this.listsTeam = {teams};
    });
    console.log(this.listsTeam)
    console.log("teset");
    console.log(this.listsTeam)
  }
  // async refreshTeams() {
  //   try {
  //     const teams: Team[] = await this.teamservice.getObjects().toPromise();
  //     // split project to status categories
  //     this.listsTeam = { teams };
  //   } catch (error) {
  //     // Handle error
  //   }
  // }
  unsorted = (): number => {
    return 0;
  };
  public drop(event: CdkDragDrop<any>): void {
    if (event.previousContainer !== event.container) {
      const project = event.item.data;
      this.teamservice.updateObject(project);
    }
  }

  public addTeam(name: string): void {
    this.teamservice.createOject({
      name,
    });
  }
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async removeTeam(project: Team) {
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
    await this.teamservice.deleteObject(project);
    await this.delay(2000); // Wait for 2 seconds
    this.refreshTeams();
  }
  public Adduser(team: Team): void {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    // open angular material dialog
    this.dialog.open(EmployeesComponent, {
      height: '80%',
      width: '55%',
      autoFocus: true,
      data: { team },
      direction: tempDirection,
    });
  }
  public newTeamDialog(): void {
    this.dialogOpen('Créer une nouvelle équipe', null);
    
  }

  public editTeamDialog(team: Team): void {
    this.dialogOpen('Modifier Equipe', team);
  }

  private dialogOpen(title: string, team: Team | any): void {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    // open angular material dialog
    this.dialog.open(TeamDialogComponent, {
      height: '40%',
      width: '55%',
      autoFocus: true,
      data: {title,team,},
      direction: tempDirection,
    });
  }
}
