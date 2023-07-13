import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Claim, ClaimStatus } from './my-tasks.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
@Injectable()
export class MyTasksService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:9090/claim';
  isTblLoading = true;
  dataChange: BehaviorSubject<Claim[]> = new BehaviorSubject<Claim[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Claim;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Claim[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  getclaims() {
  return  this.httpClient.get<Claim[]>(this.API_URL+"/getAllClaim");
  }
  /** CRUD METHODS */
  getAllMyTaskss(): void {
    this.subs.sink = this.httpClient.get<Claim[]>(this.API_URL).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  addClaim(claim: Claim): Observable<Claim> {
    this.dialogData = claim;
    return  this.httpClient.post<Claim>(this.API_URL+"/addClaim",claim);
  }
  updateClaim(id: number, claim: Claim): Observable<Claim> {
    return this.httpClient.put<Claim>(`${this.API_URL}/updateClaim/${id}`, claim);
  }
  deleteMyTasks(id: number) {
    return this.httpClient.delete<Claim>(this.API_URL + "/deleteClaim/"+ id);
  }
}
