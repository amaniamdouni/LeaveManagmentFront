import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl,Validators,UntypedFormGroup,UntypedFormBuilder, FormGroup, AbstractControl, ValidationErrors, ValidatorFn,} from '@angular/forms';
import { User } from 'app/models/user';
import { UserService } from 'app/services/user.service';
import { Role} from 'app/models/role';

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
  roles : Role[];
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
    this.roles = [Role.Admin, Role.Employee];
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
      matricule: [this.user.matricule],
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
      confirmPassword: [''],
      role: [this.user.role] // Add role field to form group
    }, { validator: this.passwordMatchValidator });
  }
  passwordMatchValidator(formGroup: FormGroup) {
      if (formGroup.controls['matricule'].value !== '') {
      return null;
      }
    const password = formGroup.controls['password'].value;
    const confirmPassword = formGroup.controls['confirmPassword'].value;
    return password === confirmPassword ? null : { passwordsNotMatch: true };
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    if (this.userForm.getRawValue().matricule === '') {
      this.userservice.addUser(this.userForm.getRawValue());
    }else{
      this.userservice.updateUser(this.userForm.getRawValue());
    }
  }
}
