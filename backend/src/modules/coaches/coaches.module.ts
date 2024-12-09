import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoachesController } from './coaches.controller';
import { CoachesService } from './coaches.service';
import { Coach, CoachSchema } from '../../schemas/coach.schema';
import { Team, TeamSchema } from '../../schemas/team.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coach.name, schema: CoachSchema },
      { name: Team.name, schema: TeamSchema }
    ])
  ],
  controllers: [CoachesController],
  providers: [CoachesService],
  exports: [CoachesService]
})
export class CoachesModule {} 