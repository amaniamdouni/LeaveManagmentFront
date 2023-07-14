import { Team } from "./TeamAdapter";

export interface Event {
    id: number;
    eventTitle: string;
    dateEvent: Date;
    eventType: string;
    description: string;
    team: Team;
  }