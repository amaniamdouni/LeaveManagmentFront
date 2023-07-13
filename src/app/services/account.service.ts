import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly API_URL = 'http://localhost:9090/team/';

  constructor(private http: HttpClient) { }

  onLogin(obj:any) :Observable<any>{
    return this.http.post(this.API_URL,obj)
  }
}
