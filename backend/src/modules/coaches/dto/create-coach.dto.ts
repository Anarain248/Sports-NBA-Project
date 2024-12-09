import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCoachDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  experience: number;

  @IsString()
  @IsOptional()
  specialization?: string;

  @IsString()
  @IsOptional()
  teamId?: string;
} 