import { formatDate } from '@angular/common';
export class Calendar {
  id: any;
  eventTitle: string;
  eventType: string;
  startDate: Date;
  endDate: Date;
  details: string;

  constructor(calendar: Calendar) {
    {
      this.id = calendar.id;
      this.eventTitle = calendar.eventTitle || '';
      this.eventType = calendar.eventType || '';
     // this.startDate = calendar.startDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
     // this.endDate = calendar.endDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.details = calendar.details || '';
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
