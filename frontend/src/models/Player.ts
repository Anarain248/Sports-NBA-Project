import { Team } from './Team';

export interface Player {
  _id: string;
  firstName: string;
  lastName: string;
  position: string;
  jerseyNumber: number;
  height?: string;
  weight?: string;
  team?: Team;
  teamId?: string;
  createdAt: Date;
  updatedAt: Date;
}