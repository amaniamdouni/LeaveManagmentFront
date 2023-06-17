import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@core';
import { BehaviorSubject, Observable } from 'rxjs';

import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class UserService extends UnsubscribeOnDestroyAdapter  {
  httpOptions= {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    })
  };
  isTblLoading = true;
  dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(
    []
  );
  get data(): User[] {
    return this.dataChange.value;
  }
  // Temporarily stores data from dialogs
  dialogData!: User;
  private readonly API_URL = 'http://localhost:9090/users/';

  constructor(private httpClient: HttpClient) { 
    super();
  }
  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.API_URL);;
  }
  }
