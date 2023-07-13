import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Leaves } from '../models/leaves.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
@Injectable()
export class LeavesService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:8081/leave';
  httpOptions= {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    })
  };
  isTblLoading = true;
  dataChange: BehaviorSubject<Leaves[]> = new BehaviorSubject<Leaves[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Leaves;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Leaves[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  getAllMyLeaves()
  {
    console.log(this.httpOptions);
    return this.httpClient.get<Leaves[]>(this.API_URL,this.httpOptions);
  }

  updateLeave(leave:Leaves)
  {
    return this.httpClient.put<Leaves>(this.API_URL+"/update",leave);
  }

  deleteLeave(id:number)
  {
    return this.httpClient.delete(this.API_URL+"/delete/"+id);
  }

  addLeave(leave:Leaves,matricule:string) {

    return this.httpClient.post<Leaves>(this.API_URL+"/add/"+matricule,leave,this.httpOptions);
  }

  leaveResponse(leave:Leaves)
  {
    return this.httpClient.put<Leaves>(this.API_URL+"/response",leave);
  }
}
