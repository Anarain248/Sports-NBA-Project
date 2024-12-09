import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsString()
  city: string;

  @IsEnum(['Eastern', 'Western'])
  conference: string;

  @IsOptional()
  @IsString()
  coachId?: string;
} 