import { Component, Inject } from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
} from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Team } from 'app/models/TeamAdapter';
import { TeamService } from 'app/services/team.service';
import { UserService } from 'app/services/user.service';
import { BoardComponent } from '../board/board.component';
import { User } from 'app/models/user';

export interface DialogData {
  id: number;
  action: string;
  title: string;
  team: Team;
}

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  providers: [],
})
export class UserDialogComponent {
  public team: Team;
  public dialogTitle: string;
  public teamForm: UntypedFormGroup;
  listUser : User[];
  private pollingInterval: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    private snackBar: MatSnackBar,    
    private teamservice: TeamService,
    private userservice:UserService,
    //private compOne: BoardComponent
  ) {
    this.listUser=[];
    this.dialogTitle = data.title;
    this.team = data.team;
    const nonWhiteSpaceRegExp = new RegExp('\\S');
    console.log(this.team);
    this.teamForm = this.formBuilder.group({
      user: [this.team?.user?.matricule,
        [Validators.required],
      ],
    
    });
    
    this.pollingInterval = setInterval(() => {
      this.refreshUser();
    }, 1000);
  }
  refreshUser() {
    this.userservice.getUsers().subscribe((res: User[]) => {
      this.listUser = res;
      console.log(res);
    });
  }
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async save() {
    if (!this.teamForm.valid) {
      return;
    }
    const user = this.listUser.find(u => u.matricule === this.teamForm.value.user);
    this.teamForm.value.user = user;
    this.teamForm.value.userList = [];
    if (this.team) {
      this.teamservice.affectUserToTeam(this.team,user?.matricule||'');
      this.snackBar.open('User affected Successfully...!!!', '', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'black',
      });

      this.dialogRef.close();
    }
    await this.delay(2000);
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

