import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { EstimatesService } from '../../estimates.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { Estimates } from '../../estimates.model';
import { User } from 'app/models/user';
import { UserService } from 'app/services/user.service';

export interface DialogData {
  id: number;
  action: string;
  estimates: User;
}

@Component({
  selector: 'app-form-dialog:not(k)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  estimatesForm: UntypedFormGroup;
  estimates: User;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public estimatesService: EstimatesService,
    public userservice : UserService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.estimates.firstName;
      this.estimates = data.estimates;
    } else {
      this.dialogTitle = 'New Estimates';
      const blankObject = {} as User;
      this.estimates = new User(blankObject);
    }
    this.estimatesForm = this.createContactForm();
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
      id: [this.estimates.id],
      firstName: [this.estimates.firstName],
      lastName: [this.estimates.lastName],
      address: [this.estimates.address],
      position: [this.estimates.position],
      email: [this.estimates.email],
      birthDate: [this.estimates.birthDate],
      startDate: [this.estimates.startDate],
      leaveBalance: [this.estimates.leaveBalance],
      phoneNumber: [this.estimates.phoneNumber],
      phoneSecondary: [this.estimates.phoneSecondary],
      password: [this.estimates.password],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    console.log(this.estimatesForm);
    this.userservice.addEstimates(this.estimatesForm.getRawValue());
  }
}
