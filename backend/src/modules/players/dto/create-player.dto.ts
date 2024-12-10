export class CreatePlayerDto {
  firstName: string;
  lastName: string;
  position: string;
  jerseyNumber: number;
  height?: string;
  weight?: string;
  teamId?: string;
} 