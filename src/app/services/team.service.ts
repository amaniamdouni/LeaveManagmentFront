import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
// import { PROJETS } from "./project.data";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Team, TeamAdapter } from 'app/models/TeamAdapter';
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
  private readonly API_URL = 'http://localhost:9090/team/';

  constructor(private adapter: TeamAdapter, private httpClient: HttpClient) {
    super();
    // this._projects.next(PROJECTS); // mock up backend with fake data (not Project objects yet!)
    this.getAllProjectss();
  }

  /** CRUD METHODS */
  getAllProjectss(): void {
    this.subs.sink = this.httpClient.get<Team[]>(this.API_URL).subscribe({
      next: (data) => {
        this._projects.next(data); // mock up backend with fake data (not Project objects yet!)
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      },
    });
  }

  public getObjects(): Observable<Team[]> {
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
    project.id = this._projects.getValue().length + 1; // mock Project object with fake id (we have no backend)
    this._projects.next(this._projects.getValue().concat(project));
  }

  public updateObject(project: Team): void {
    console.log(project.id);
    this.httpClient.put(this.API_URL,project,this.httpOptions)
  }

  public deleteObject(project: Team): void {
    this._projects.next(
      this._projects.getValue().filter((t: any) => t.id !== project.id)
    );
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
