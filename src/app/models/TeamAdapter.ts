import { Injectable } from '@angular/core';
import { Adapter } from './Adapter';
import { User } from 'app/models/user';

export class Team {
  
  constructor(
    public id: number,
    public nameTeam: string,
    public description?: string,
    public archive?: boolean,
    public createdOn?: Date,
    public user?:User,
    public userList?:User[]
  ) {}

}

@Injectable({
  providedIn: 'root',
})
export class TeamAdapter implements Adapter<Team> {
  adapt(item: any): Team {
    const adapted = new Team(
      Number(item.id),
      item.nameTeam,
      item.description,
      item.archive,
      item.createdOn ? new Date(item.createdOn) : undefined,
      item.user ? item.user : new User(item.user),
      item.userList ? item.userList : [],
    );
    return adapted;
  }
}
