import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { LeavesService } from '../leaves.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { Leaves } from '../../models/leaves.model';
import { formatDate } from '@angular/common';
import { LeaveStatus } from '../../models/leaveStatus';
import { LeaveType } from '../../models/leaveType';
import { User } from '../../models/user.model';
import { AuthService } from 'app/services/auth.service';

export interface DialogData {
  id: number;
  action: string;
  leaves: Leaves;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  action: string;
  dialogTitle?: string;
  isDetails = false;
  leavesForm!: UntypedFormGroup;
  leaves: Leaves;
  leaveStatutList = LeaveStatus;
  leaveTypeList = LeaveType;
 matricule =
        this.authService.currentUserValue.matricule ;
        teamAvailability: boolean;
  constructor(
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public leavesService: LeavesService,
    private fb: UntypedFormBuilder,
    private authService: AuthService,
  ) {
    // Set the defaults

        console.log(this.matricule);
    this.action = data.action;
    console.log(data);
    if (this.action === 'edit') {
      this.isDetails = false;
      this.dialogTitle = data.leaves.user.firstName+' '+data.leaves.user.lastName;
      this.leaves = data.leaves;
      this.leavesForm = this.createContactForm();
    } else if (this.action === 'details') {
      this.leaves = data.leaves;
      console.log(this.leaves);
      this.teamAvailability = data.leaves.teamAvailability;
      this.isDetails = true;
      this.leavesForm = this.createContactFormRH();
    } else {
      this.isDetails = false;
      console.log(this.isDetails);
      this.dialogTitle = 'New Leaves';
      const blankObject = {} as Leaves;
      this.leaves = new Leaves(blankObject);
      this.leavesForm = this.createContactForm();
    }
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.type,
  ]);
  // getErrorMessage() {
  //   return this.formControl.hasError('required')
  //     ? 'Required field'
  //     : this.formControl.hasError('type')
  //     ? 'Not a valid type'
  //     : '';
  // }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.leaves.id],
      nbr_days: [this.leaves.nbr_days, [Validators.required]],
      createdAt: [this.leaves.createdAt, [Validators.required]],
      startDate: [this.leaves.startDate, [Validators.required]],
      endDate: [this.leaves.endDate, [Validators.required]],
      leaveType: [this.leaves.leaveType, [Validators.required]],
      leaveStatus: [this.leaves.leaveStatus],
      comment: [this.leaves.comment, [Validators.required]]
    });
  }
  createContactFormRH(): UntypedFormGroup {
    return this.fb.group({
      id: [this.leaves.id],
      nbr_days: [this.leaves.nbr_days, [Validators.required]],
      createdAt: [this.leaves.createdAt, [Validators.required]],
      startDate: [this.leaves.startDate, [Validators.required]],
      endDate: [this.leaves.endDate, [Validators.required]],
      leaveType: [this.leaves.leaveType, [Validators.required]],
      leaveStatus: [this.leaves.leaveStatus],
      comment: [this.leaves.comment, [Validators.required]],
      teamAvailability: [this.leaves.teamAvailability]
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
      console.log(this.leavesForm.value);
      //this.leavesForm.value.user = new User(1,"test","test");
      this.leavesService.updateLeave(this.leavesForm.value).subscribe((result) => {
        console.log(result);
      },
      (err) => {
        console.log(err);
      });
    } else {
     // this.leavesForm.value.user = new User(1,"test","test");
     console.log(this.leavesForm.value);
      this.leavesService.addLeave(this.leavesForm.value,this.matricule).subscribe((result) => {
        console.log(result);
      },
      (err) => {
        console.log(err);
      });
    }
  }
  leaveApproved() {
    this.leavesForm.value.leaveStatus = LeaveStatus.APPROVED;
    this.leavesForm.value.user = this.data.leaves.user;
    this.leavesService.updateLeave(this.leavesForm.value).subscribe((result) => {
      console.log(result);
    },
    (err) => {
      console.log(err);
    });
  }
  leaveOnHold() {
    this.leavesForm.value.leaveStatus = LeaveStatus.ON_HOLD;
    this.leavesForm.value.user = this.data.leaves.user;
    this.leavesService.updateLeave(this.leavesForm.value).subscribe((result) => {
      console.log(result);
    },
    (err) => {
      console.log(err);
    });
  }
  leaveRefused() {
    this.leavesForm.value.leaveStatus = LeaveStatus.REFUSED;
    this.leavesForm.value.user = this.data.leaves.user;
    this.leavesService.updateLeave(this.leavesForm.value).subscribe((result) => {
      console.log(result);
    },
    (err) => {
      console.log(err);
    });
  }
}
