import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AllClaims } from './leave-report.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
@Injectable()
export class LeaveReportService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:9090/claim';
  isTblLoading = true;
  dataChange: BehaviorSubject<AllClaims[]> = new BehaviorSubject<
    AllClaims[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: AllClaims;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): AllClaims[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllLeavess(): Observable<AllClaims[]> {
    return this.httpClient.get<AllClaims[]>(this.API_URL+"/getAllClaim");
  }
}
