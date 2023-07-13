import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Leaves } from './models/leaves.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
@Injectable()
export class MyLeavesService extends UnsubscribeOnDestroyAdapter {
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
  // get data(): Leaves[] {
  //   return this.dataChange.value;
  // }
   getDialogData() {
     return this.dialogData;
   }
  /** CRUD METHODS */
  // getAllMyLeaves(): void {
  //   this.subs.sink = this.httpClient.get<Leaves[]>(this.API_URL).subscribe({
  //     next: (data) => {
  //       this.isTblLoading = false;
  //       this.dataChange.next(data);
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       this.isTblLoading = false;
  //       console.log(error.name + ' ' + error.message);
  //     },
  //   });
  // }
  getAllMyLeaves()
  {
    return this.httpClient.get<Leaves[]>(this.API_URL);
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
  // addMyLeaves(Leaves: Leaves): void {
  //   this.dialogData = Leaves;

  //   // this.httpClient.post(this.API_URL, Leaves)
  //   //   .subscribe({
  //   //     next: (data) => {
  //   //       this.dialogData = Leaves;
  //   //     },
  //   //     error: (error: HttpErrorResponse) => {
  //   //        // error code here
  //   //     },
  //   //   });
  }
  // updateMyLeaves(Leaves: Leaves): void {
  //   this.dialogData = Leaves;

  //   // this.httpClient.put(this.API_URL + Leaves.id, Leaves)
  //   //     .subscribe({
  //   //       next: (data) => {
  //   //         this.dialogData = Leaves;
  //   //       },
  //   //       error: (error: HttpErrorResponse) => {
  //   //          // error code here
  //   //       },
  //   //     });
  // }
  // deleteMyLeaves(id: number): void {
  //   console.log(id);

  //   // this.httpClient.delete(this.API_URL + id)
  //   //     .subscribe({
  //   //       next: (data) => {
  //   //         console.log(id);
  //   //       },
  //   //       error: (error: HttpErrorResponse) => {
  //   //          // error code here
  //   //       },
  //   //     });
  // }

