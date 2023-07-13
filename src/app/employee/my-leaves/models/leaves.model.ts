import { LeaveStatus } from "./leaveStatus";
import { LeaveType } from "./leaveType";

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
  user: string;
  teamAvailability : boolean;

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
      this.user = myLeaves.user
      this.teamAvailability = myLeaves.teamAvailability;
    }
  }
}
