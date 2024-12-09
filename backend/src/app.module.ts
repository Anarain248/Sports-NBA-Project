import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsModule } from './modules/teams/teams.module';
import { CoachesModule } from './modules/coaches/coaches.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nba-management'),
    TeamsModule,
    CoachesModule,
    // Add other modules here
  ],
})
export class AppModule {}
