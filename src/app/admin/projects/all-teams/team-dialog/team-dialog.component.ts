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
<<<<<<< HEAD:src/app/admin/projects/all-projects/project-dialog/project-dialog.component.ts
=======
import { User } from 'app/models/user';
>>>>>>> farah-user-front:src/app/admin/projects/all-teams/team-dialog/team-dialog.component.ts
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
  selector: 'app-team-dialog',
  templateUrl: './team-dialog.component.html',
  providers: [BoardComponent],
})
export class TeamDialogComponent {
  public team: Team;
  public dialogTitle: string;
  public teamForm: UntypedFormGroup;
  listUser : User[];
  private pollingInterval: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<TeamDialogComponent>,
    private snackBar: MatSnackBar,    
    private teamservice: TeamService,
    private userservice:UserService,
    private compOne: BoardComponent
  ) {
    this.listUser=[];
    this.dialogTitle = data.title;
    this.team = data.team;
    const nonWhiteSpaceRegExp = new RegExp('\\S');

    this.teamForm = this.formBuilder.group({
      nameTeam: [
        this.team?.nameTeam,
        [Validators.required, Validators.pattern(nonWhiteSpaceRegExp)],
      ],
      description: [this.team?.description,
        [Validators.required],
      ],
      user: [this.team?.user?.matricule,
        [Validators.required],
      ]
    });
    this.pollingInterval = setInterval(() => {
      this.refreshUser();
    }, 1000);
  }
  refreshUser() {
    this.userservice.getUsers().subscribe((res: User[]) => {
      this.listUser = res;
    });
  }
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async save() {
    console.log('save');
    if (!this.teamForm.valid) {
      return;
    }
    console.log(this.teamForm.value.createdOn);
    var user = this.listUser.find(u => u.matricule === this.teamForm.value.user);
    this.teamForm.value.user = user;
    this.teamForm.value.createdOn = "2023-06-16";
    this.teamForm.value.archive = false;
    this.teamForm.value.userList = [];
    if (this.team) {
      // update project object with form values
      Object.assign(this.team, this.teamForm.value);
      console.log(this.team);
      this.teamservice.updateObject(this.team);
      this.snackBar.open('Project updated Successfully...!!!', '', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'black',
      });

      this.dialogRef.close();
    } else {
      this.teamservice.createOject(this.teamForm.value);
      this.snackBar.open('Project created Successfully...!!!', '', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'black',
      });

      this.dialogRef.close();
    }
    await this.delay(2000); // Wait for 2 seconds

    await this.compOne.ngOnInit().then(() => console.log('Finished'))
    .catch(() => console.error('Failed!'));;
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

