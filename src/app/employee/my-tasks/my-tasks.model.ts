import { formatDate } from '@angular/common';
export class Claim {
  id: number;
  status: string;
  priority: string;
  type: string;
  date: string;
  description: string;
  constructor(myTasks: Claim) {
    {
      this.id = myTasks.id || this.getRandomID();
      this.status = myTasks.status || '';
      this.priority = myTasks.priority || '';
      this.type = myTasks.type || '';
      this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.description = myTasks.description || '';
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
