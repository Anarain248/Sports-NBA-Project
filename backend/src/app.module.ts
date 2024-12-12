import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsModule } from './modules/teams/teams.module';
import { CoachesModule } from './modules/coaches/coaches.module';
import { PlayersModule } from './modules/players/players.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    TeamsModule,
    CoachesModule,
    PlayersModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
