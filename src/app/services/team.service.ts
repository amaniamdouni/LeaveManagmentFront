import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
// import { PROJETS } from "./project.data";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Team, TeamAdapter } from 'app/models/TeamAdapter';
import { DatePipe } from '@angular/common';
import { Archive } from 'angular-feather/icons';
import { Leave } from 'app/models/Leave';
@Injectable({
  providedIn: 'root'
})
export class TeamService extends UnsubscribeOnDestroyAdapter {
  httpOptions= {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    })
  };
  private trash: Set<number> = new Set([]); // trashed projects' id; set is better for unique ids
  // private _projects: BehaviorSubject<object[]> = new BehaviorSubject([]);
  private _projects = new BehaviorSubject<object[]>([]);
  public readonly projects: Observable<object[]> =
    this._projects.asObservable();
  private readonly API_URL = 'http://localhost:9091/team/';
  isTblLoading = true;
  dataChange: BehaviorSubject<Leave[]> = new BehaviorSubject<Leave[]>(
    []
  );
  dialogData!: Team;
  constructor(private adapter: TeamAdapter, private httpClient: HttpClient) {
    super();
    // this._projects.next(PROJECTS); // mock up backend with fake data (not Project objects yet!)
  }

  /** CRUD METHODS */
  async getAllProjectss() {
    this.subs.sink = this.httpClient.get<Team[]>(this.API_URL).subscribe({
      next: (data) => {
        this._projects.next(data); // mock up backend with fake data (not Project objects yet!)
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  async getAllProjectssByTeam() {
    return this.httpClient.get<Leave[]>(this.API_URL+"retrieveLeavesByTeam/3").pipe(
      tap((data: Leave[]) => {
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
  
  public getObjects(): Observable<Team[]> {
    this.getAllProjectss();
    console.log(this.projects);
    return this.projects.pipe(
      map((data: any[]) =>
        data
          .filter(
            // do not return objects marked for delete
            (item: any) => !this.trash.has(item.id)
          )
          .map(
            // convert objects to Project instances
            (item: any) => this.adapter.adapt(item)
          )
          
      )
      
    );
  }

  public getObjectById(id: number): Observable<Team> {
    return this.projects.pipe(
      map(
        (data: any) =>
          data
            .filter(
              // find object by id
              (item: any) => item.id === id
            )
            .map(
              // convert to Project instance
              (item: any) => this.adapter.adapt(item)
            )[0]
      )
    );
  }

  public createOject(project: any): void {
    this.httpClient.put(this.API_URL, project,this.httpOptions)
        .subscribe({
          next: (data) => {
            this.dialogData = project;
          },
          error: (error: HttpErrorResponse) => {
             // error code here
          },
        }); 
  }

  public updateObject(project: Team): void {  
    this.httpClient.put(this.API_URL, project,this.httpOptions)
        .subscribe({
          next: (data) => {
            this.dialogData = project;
          },
          error: (error: HttpErrorResponse) => {
             // error code here
          },
        });  
  }
  

  async deleteObject(project: Team)  {
    console.log(this.API_URL + project.id,this.httpOptions);
    this.httpClient.delete(this.API_URL + project.id)
        .subscribe({
          next: (data) => {
            console.log(project.id);
          },
          error: (error: HttpErrorResponse) => {
             // error code here
          },
        });
  }

  public detachObject(project: Team): void {
    // add project id to trash
    this.trash.add(project.id);
    // force emit change for projects observers
    return this._projects.next(this._projects.getValue());
  }

  public attachObject(project: Team): void {
    // remove project id from trash
    this.trash.delete(project.id);
  }
}
