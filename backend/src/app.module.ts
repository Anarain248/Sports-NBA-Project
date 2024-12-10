import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsModule } from './modules/teams/teams.module';
import { CoachesModule } from './modules/coaches/coaches.module';
import { PlayersModule } from './modules/players/players.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    TeamsModule,
    CoachesModule,
    PlayersModule
  ],
})
export class AppModule {}
