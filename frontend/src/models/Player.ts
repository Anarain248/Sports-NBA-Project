import { Team } from "./Team";

export interface Player {
    id: string;
    firstName: string;
    lastName: string;
    position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
    jerseyNumber: number;
    height: string;
    weight: number;
    teamId?: string;
    team?: Team 
    stats?: PlayerStats;
    createdAt: Date;
    updatedAt: Date;
  }
  
  interface PlayerStats {
    pointsPerGame: number;
    assistsPerGame: number;
    reboundsPerGame: number;
    // Add more stats as needed
  }