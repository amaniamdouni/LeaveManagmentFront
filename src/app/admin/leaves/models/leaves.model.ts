import { formatDate } from '@angular/common';
import { LeaveStatus } from './leaveStatus';
import { LeaveType } from './leaveType';
import { User } from './user.model';
import { leavePriority } from './leavePriority.model';
export class Leaves {
  id: number;
  //halfDay: string;
  startDate: Date;
  endDate: Date;
  comment: string;
  leaveStatus: LeaveStatus;
  nbr_days: number;
  createdAt: Date;
  leaveType: LeaveType;
  archived: boolean;
  user: User;
  leavePriority: leavePriority;
  teamAvailability: boolean;

  constructor(myLeaves: Leaves) {
    {
      this.id = myLeaves.id;
      this.startDate = myLeaves.startDate;
      this.endDate = myLeaves.endDate;
      this.comment = myLeaves.comment;
      this.nbr_days = myLeaves.nbr_days;
      this.createdAt = myLeaves.createdAt;
      this.archived = myLeaves.archived;
      this.leaveStatus = myLeaves.leaveStatus;
      this.leaveType = myLeaves.leaveType;
      this.user = myLeaves.user;
      this.leavePriority = myLeaves.leavePriority;
      this.teamAvailability = myLeaves.teamAvailability;
    }
  }
}
