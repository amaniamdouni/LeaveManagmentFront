import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Calendar } from './calendar.model';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()
export class CalendarService {
  private readonly API_URL = 'http://localhost:9090/event/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  dataChange: BehaviorSubject<Calendar[]> = new BehaviorSubject<Calendar[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: any;
  constructor(private httpClient: HttpClient) {}
  get data(): Calendar[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  // getAllCalendars(): Observable<Calendar[]> {
   // return this.httpClient
     // .get<Calendar[]>(this.API_URL)
      //.pipe(catchError(this.errorHandler));
  //}

  getAllCalendars() {
    return this.httpClient.get<Calendar[]>(this.API_URL)
  }
  add(event:any) {
    return this.httpClient.post<any>(this.API_URL,event)
  }
  put(event:any) {
    return this.httpClient.put<Calendar>(this.API_URL,event)
  }
  delete(event:any) {
    return this.httpClient.delete<Calendar>(this.API_URL+event.id)
  }
  addUpdateCalendar(calendar: Calendar): void {
    this.dialogData = calendar;
  }
  deleteCalendar(calendar: Calendar): void {
    this.dialogData = calendar;
  }
  errorHandler(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
