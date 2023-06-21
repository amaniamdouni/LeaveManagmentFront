import { User } from "./user";

export class Leave {
    id: number;
    startDate: Date;
    endDate: Date;
    comment: string;
    leaveStatus: string;
    nbr_days: number;
    createdAt: Date;
    leaveType: string;
    user: User;
    constructor(user: Leave) {
        {
          this.id = user.id || 0;
          this.startDate = user.startDate || '';
          this.endDate = user.endDate || '';
          this.comment = user.comment || '';
          this.nbr_days = user.nbr_days || 0;
          this.createdAt = user.createdAt || '';
          this.leaveStatus = user.leaveStatus || '';
          this.startDate = user.startDate || '';
          this.leaveType = user.leaveType || '';
          this.user = user.user || new User({} as User);
        }
      }
  }
  