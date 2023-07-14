import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { formatDate } from '@angular/common';
import { MyTasksService } from '../../my-tasks.service';
import { Claim } from '../../my-tasks.model';

export interface DialogData {
  id: number;
  action: string;
  myTasks: Claim;
}

@Component({
  selector: 'app-form-dialog:not(p)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  myTasksForm: UntypedFormGroup;
  myTasks: Claim;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public myTasksService: MyTasksService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.myTasks.description;
      this.myTasks = data.myTasks;
    } else {
      this.dialogTitle = 'New MyTasks';
      const blankObject = {} as Claim;
      this.myTasks = new Claim();
    }
    this.myTasksForm = this.createContactForm();
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.myTasks.id],
      claimStatus: [this.myTasks.claimStatus],
      claimPriority: [this.myTasks.claimPriority],
      //type: [this.myTasks.type],
      dateClaim: [this.myTasks.dateClaim],
      description: [this.myTasks.description],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    if (this.action === 'edit') {
      console.log(this.myTasksForm.value);
      const updatedClaim: Claim = this.myTasksForm.value;
      this.myTasksService.updateClaim(updatedClaim.id, updatedClaim).subscribe(
        (result) => {
          console.log(result);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.myTasksService.addClaim(this.myTasksForm.value).subscribe(
        (result) => {
          console.log(result);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
