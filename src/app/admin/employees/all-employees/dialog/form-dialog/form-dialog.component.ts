import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl,Validators,UntypedFormGroup,UntypedFormBuilder,} from '@angular/forms';
import { User } from 'app/models/user';
import { UserService } from 'app/services/user.service';

export interface DialogData {
  matricule: string;
  action: string;
  user: User;
}

@Component({
  selector: 'app-form-dialog:not(k)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  userForm: UntypedFormGroup;
  user: User;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public userservice : UserService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle =  'Edit User';
      this.user = data.user;
    } else {
      this.dialogTitle = 'New User';
      const blankObject = {} as User;
      this.user = new User(blankObject);
    }
    this.userForm = this.createContactForm();
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
    console.log(this.user)
    return this.fb.group({
      firstName: [this.user.firstName],
      lastName: [this.user.lastName],
      address: [this.user.address],
      position: [this.user.position],
      email: [this.user.email],
      birthDate: [this.user.birthDate],
      startDate: [this.user.startDate],
      leaveBalance: [this.user.leaveBalance],
      phoneNumber: [this.user.phoneNumber],
      phoneSecondary: [this.user.phoneSecondary],
      password: [this.user.password],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    console.log(this.userForm);
    this.userservice.addUser(this.userForm.getRawValue());
  }
}
