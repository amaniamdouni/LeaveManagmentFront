import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from 'app/models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { UnsubscribeOnDestroyAdapter } from '@shared';
import { AuthService } from './auth.service';

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

    private readonly API_URL = 'http://localhost:9090/user';
    isTblLoading = true;
    dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(
      []
    );
    // Temporarily stores data from dialogs
    dialogData!: User;
    auth_token : string;
    headers : HttpHeaders;
    currentUser: User;

    constructor(private httpClient: HttpClient,private authService: AuthService) {
      super();
      this.getAllusers();
      this.currentUser = this.authService.currentUserValue;
      this.auth_token = '';
      let auth_token = this.currentUser.token;
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        'Authorization': `Bearer ${auth_token}`
      });
      // th
    }
    get data(): User[] {
      return this.dataChange.value;
    }
    getDialogData() {
      return this.dialogData;
    }
    /** CRUD METHODS */
    getAllusers(): Observable<User[]> {
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
      return this.httpClient.get<User[]>(this.API_URL);

    }
    addUser(user: User): void {
      let requestOptions = { headers: this.headers };
      this.dialogData = user;
      console.log(user);
      this.httpClient.post(this.API_URL, user,requestOptions)
      .subscribe({
        next: (data) => {
          this.dialogData = user;
        },
        error: (error: HttpErrorResponse) => {
           // error code here
        },
      });
    }
  updateUser(user: User): void {
      this.dialogData = user;
      this.httpClient.put(this.API_URL, user)
          .subscribe({
            next: (data) => {
              this.dialogData = user;
            },
            error: (error: HttpErrorResponse) => {
               // error code here
            },
          });
  }
  deleteUser( matricule: string ): void {
       this.httpClient.delete(this.API_URL+ '/'+matricule,)
          .subscribe({
            error: (error: HttpErrorResponse) => {
               // error code here
            },
          });
    }
  }
  