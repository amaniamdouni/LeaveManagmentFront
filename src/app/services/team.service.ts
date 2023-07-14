import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
// import { PROJETS } from "./project.data";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Team, TeamAdapter } from 'app/models/TeamAdapter';
import { Leave } from 'app/models/Leave';
import { User } from 'app/models/user';
import { AuthService } from './auth.service';
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
  private _teams = new BehaviorSubject<object[]>([]);
  public readonly teams: Observable<object[]> =
    this._teams.asObservable();
  private readonly API_URL = 'http://localhost:9090/team/';
  isTblLoading = true;
  currentUser: User;
  auth_token : string;
  headers : HttpHeaders;
  dataChange: BehaviorSubject<Leave[]> = new BehaviorSubject<Leave[]>(
    []
  );
  dialogData!: Team;
  constructor(private adapter: TeamAdapter, private httpClient: HttpClient,private authService: AuthService) {
    super();
    this.currentUser = this.authService.currentUserValue;
    this.auth_token = '';
    let auth_token = this.currentUser.token;
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Authorization': `Bearer ${auth_token}`
    });
    // this._projects.next(PROJECTS); // mock up backend with fake data (not Project objects yet!)
  }

  /** CRUD METHODS */
  async getAllTeams() {
    let requestOptions = { headers: this.headers };
    console.log(requestOptions);
    this.subs.sink = this.httpClient.get<Team[]>(this.API_URL,requestOptions).subscribe({
      next: (data) => {
        this._teams.next(data);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  async getAllLeavesByTeam() {
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
    this.getAllTeams();
    console.log(this.teams);
    return this.teams.pipe(
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
    return this.teams.pipe(
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

  public createOject(team: any): void {
    this.httpClient.put(this.API_URL, team,this.httpOptions)
        .subscribe({
          next: (data) => {
            this.dialogData = team;
          },
          error: (error: HttpErrorResponse) => {
             // error code here
          },
        }); 
  }

  public updateObject(team: Team): void {  
    this.httpClient.put(this.API_URL, team,this.httpOptions)
        .subscribe({
          next: (data) => {
            this.dialogData = team;
          },
          error: (error: HttpErrorResponse) => {
             // error code here
          },
        });  
  }
  

  async deleteObject(team: Team)  {
    console.log(this.API_URL + team.id,this.httpOptions);
    this.httpClient.delete(this.API_URL + team.id)
        .subscribe({
          next: (data) => {
            console.log(team.id);
          },
          error: (error: HttpErrorResponse) => {
             // error code here
          },
        });
  }
  affectUserToTeam(team:Team,matricule:string){
    let requestOptions = { headers: this.headers };
    this.httpClient.put(this.API_URL+matricule+"/"+team.id,requestOptions)
    .subscribe({
      next: (data) => {
          console.log(data);

            },
      error: (error: HttpErrorResponse) => {
         // error code here
      },
    }); 
  }
  desaffectUserFromTeam(team:Team,matricule:string){
    let requestOptions = { headers: this.headers };
    console.log(this.API_URL+"desaffectUserToTeam/"+matricule+"/"+team.id);
    this.httpClient.put(this.API_URL+"desaffectUserToTeam/"+matricule+"/"+team.id,requestOptions)
    .subscribe({
      next: (data) => {
          console.log(data);

            },
      error: (error: HttpErrorResponse) => {
         // error code here
      },
    }); 
  }
  public detachObject(team: Team): void {
    // add project id to trash
    this.trash.add(team.id);
    // force emit change for projects observers
    return this._teams.next(this._teams.getValue());
  }

  public attachObject(team: Team): void {
    // remove project id from trash
    this.trash.delete(team.id);
  }
}
