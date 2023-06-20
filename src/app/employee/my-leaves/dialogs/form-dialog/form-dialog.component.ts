import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { Leaves } from '../../models/leaves.model';
import { MyLeavesService } from '../../my-leaves.service';

export interface DialogData {
  id: number;
  action: string;
  Leaves: Leaves;
}

@Component({
  selector: 'app-form-dialog:not(o)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  myLeavesForm: UntypedFormGroup;
  myLeaves: Leaves;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public myLeavesService: MyLeavesService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Leave Request';
      this.myLeaves = data.Leaves;
      console.log(data);

    } else {
      this.dialogTitle = 'New Leave Request';
      const blankObject = {} as Leaves;
      this.myLeaves = new Leaves(blankObject);
    }
    this.myLeavesForm = this.createContactForm();
    // this.myLeavesForm.setValue({
    //   id: this.myLeaves.id,
    //   nbr_days: this.myLeaves.nbr_days,
    //   applyDate: this.myLeaves.createdAt,
    //   fromDate: this.myLeaves.startDate,
    //   toDate: this.myLeaves.endDate,
    //   type: this.myLeaves.leaveType,
    //   status: this.myLeaves.leaveStatus,
    //   comment: this.myLeaves.comment,
    // });
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
      id: [this.myLeaves.id],
      nbr_days: [this.myLeaves.nbr_days, [Validators.required]],
      applyDate: [this.myLeaves.createdAt, [Validators.required]],
      fromDate: [this.myLeaves.startDate, [Validators.required]],
      toDate: [this.myLeaves.endDate, [Validators.required]],
      type: [this.myLeaves.leaveType, [Validators.required]],
      status: [this.myLeaves.leaveStatus, [Validators.required]],
      comment: [this.myLeaves.comment, [Validators.required]],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    console.log(this.myLeavesForm.value);
    this.myLeavesService.updateLeave(this.myLeavesForm.value).subscribe((result) => {
      console.log(result);
    },
    (err) => {
      console.log(err);
    })
  }
}
