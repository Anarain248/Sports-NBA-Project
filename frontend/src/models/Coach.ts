import { Team } from "./Team";

export interface Coach {
    _id: string;
    firstName: string;
    lastName: string;
    experience: number;
    teamId?: string;
    team?: Team;
    specialization?: string;
    createdAt: Date;
    updatedAt: Date;
  }