import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TeamDialogComponent } from '../team-dialog/team-dialog.component';
import { Direction } from '@angular/cdk/bidi';
import { TeamService } from 'app/services/team.service';
import { Team } from 'app/models/TeamAdapter';
import { EmployeesComponent } from 'app/admin/employees/all-employees/all-employees.component';
import { User } from 'app/models/user';
import { UserService } from 'app/services/user.service';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  public lists: object;
  listUser : User[];

  public listsTeam: object;
  constructor(
    private teamservice: TeamService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userservice : UserService
  ) {
    this.lists = {};
    this.listsTeam = {};
    this.listUser=[];

  }

  async ngOnInit() {
    this.teamservice.getObjects().subscribe((teams: Team[]) => {
      // split project to status categories
      this.lists = {teams};
    });
    
      this.refreshTeams();
      await this.delay(2000);
      await this.refreshUsers();
      console.log(this.listUser);

    // this.pollingInterval = setInterval(() => {
    //   this.refreshTeams();
    // }, 5000);
  }

  // getUsersLength(team: Team): number {
  //   return team.userList?.length??0;
  // }
  async refreshUsers() {
    this.delay(2000);
    this.userservice.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.listUser = users;
      },
      error: (error: any) => {
        // Handle the error here
        console.error('Error occurred while fetching users:', error);
      }
    });
  }
  async refreshTeams() {
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
