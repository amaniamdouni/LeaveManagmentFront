import { Component, Inject } from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
} from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  Project,
  ProjectStatus,
  ProjectPriority,
  ProjectType,
} from '../core/project.model';
import { ProjectService } from '../core/project.service';
import { Team } from 'app/models/TeamAdapter';
import { TeamService } from 'app/services/team.service';
import { User } from '@core';
import { UserService } from 'app/services/user.service';
import { BoardComponent } from '../board/board.component';

export interface DialogData {
  id: number;
  action: string;
  title: string;
  project: Team;
}

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  providers: [BoardComponent],
})
export class ProjectDialogComponent {
  public project: Team;
  public dialogTitle: string;
  public projectForm: UntypedFormGroup;
  public statusChoices: typeof ProjectStatus;
  public priorityChoices: typeof ProjectPriority;
  public projectType: typeof ProjectType;
  listUser : User[];
  private pollingInterval: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    private snackBar: MatSnackBar,
    private projectService: ProjectService,    
    private teamservice: TeamService,
    private userservice:UserService,
    private compOne: BoardComponent
  ) {
    this.listUser=[];
    this.dialogTitle = data.title;
    this.project = data.project;
    this.statusChoices = ProjectStatus;
    this.priorityChoices = ProjectPriority;
    this.projectType = ProjectType;
    const nonWhiteSpaceRegExp = new RegExp('\\S');

    this.projectForm = this.formBuilder.group({
      nameTeam: [
        this.project?.nameTeam,
        [Validators.required, Validators.pattern(nonWhiteSpaceRegExp)],
      ],
      description: [this.project?.description,
        [Validators.required],
      ],
      user: [this.project?.user?.id,
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
    if (!this.projectForm.valid) {
      return;
    }
    console.log(this.projectForm.value.createdOn);
    let user = this.listUser.find(u => u.id === this.projectForm.value.user);
    this.projectForm.value.user = user;
    this.projectForm.value.createdOn = "2023-06-16";
    this.projectForm.value.archive = false;
    this.projectForm.value.userList = [];
    if (this.project) {
      // update project object with form values
      Object.assign(this.project, this.projectForm.value);
      console.log(this.project);
      this.teamservice.updateObject(this.project);
      this.snackBar.open('Project updated Successfully...!!!', '', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'black',
      });

      this.dialogRef.close();
    } else {
      this.teamservice.createOject(this.projectForm.value);
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

