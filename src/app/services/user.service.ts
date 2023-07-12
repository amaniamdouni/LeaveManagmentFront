import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { UnsubscribeOnDestroyAdapter } from '@shared';
import { User } from 'app/models/user';

@Injectable({
  providedIn: 'root'
})
@Injectable()

export class UserService extends UnsubscribeOnDestroyAdapter {
    httpOptions= {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:4200'
      })
    };
    private readonly API_URL = 'http://localhost:9090/user/';
    isTblLoading = true;
    dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(
      []
    );
    // Temporarily stores data from dialogs
    dialogData!: User;
    constructor(private httpClient: HttpClient) {
      super();
      this.getAllEstimatess();
    }
    get data(): User[] {
      return this.dataChange.value;
    }
    getDialogData() {
      return this.dialogData;
    }
    /** CRUD METHODS */
    getAllEstimatess(): Observable<User[]> {
      return this.httpClient.get<User[]>(this.API_URL).pipe(
        tap((data: User[]) => {
          this.isTblLoading = false;
          this.dataChange.next(data);
        }),
        catchError((error: HttpErrorResponse) => {
          this.isTblLoading = false;
          console.log(error.name + ' ' + error.message);
          // Throw the error again to propagate it
          throw error;
        })
      );
    }
    
    getUsers(): Observable<User[]> {
      return this.httpClient.get<User[]>(this.API_URL);;
    }
    addEstimates(estimates: User): void {
      this.dialogData = estimates;
      console.log(estimates);
      this.httpClient.post(this.API_URL, estimates)
      .subscribe({
        next: (data) => {
          this.dialogData = estimates;
        },
        error: (error: HttpErrorResponse) => {
           // error code here
        },
      });
    }
    updateEstimates(estimates: User): void {
      this.dialogData = estimates;
      console.log(estimates);
      this.httpClient.put(this.API_URL, estimates)
          .subscribe({
            next: (data) => {
              this.dialogData = estimates;
            },
            error: (error: HttpErrorResponse) => {
               // error code here
            },
          });
    }
    deleteEstimates(id: number): void {
      console.log(id);
  
      // this.httpClient.delete(this.API_URL + id)
      //     .subscribe({
      //       next: (data) => {
      //         console.log(id);
      //       },
      //       error: (error: HttpErrorResponse) => {
      //          // error code here
      //       },
      //     });
    }
  }
  