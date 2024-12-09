import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsModule } from './modules/teams/teams.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nba-management'),
    TeamsModule,
    // Add other modules here
  ],
})
export class AppModule {}
