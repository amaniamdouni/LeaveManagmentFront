import { formatDate } from '@angular/common';

export enum ClaimPriority {
  HIGH = 'HIGH',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM'
}
export enum ClaimStatus{
  IN_PROGRESS,
  ON_HOLD,
  ACCEPTED
}
export class Claim {
  id: number;
  claimStatus: ClaimStatus;
  claimPriority: ClaimPriority;
  dateClaim: Date;
  description: string;


 /* constructor(myTasks: Claim) {
    {
      this.id = myTasks.id || this.getRandomID();
      this.claimStatus = myTasks.claimStatus || '';
      this.claimPriority = myTasks.claimPriority || '';
     // this.type = myTasks.type || '';
      this.dateClaim = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.description = myTasks.description || '';
    }
  }
 /* public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }*/
}
