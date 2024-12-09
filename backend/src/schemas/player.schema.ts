import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Player extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, enum: ['PG', 'SG', 'SF', 'PF', 'C'] })
  position: string;

  @Prop({ required: true })
  jerseyNumber: number;

  @Prop()
  height: string;

  @Prop()
  weight: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Team' })
  team: MongooseSchema.Types.ObjectId;

  @Prop({
    type: {
      pointsPerGame: Number,
      assistsPerGame: Number,
      reboundsPerGame: Number,
    }
  })
  stats: {
    pointsPerGame: number;
    assistsPerGame: number;
    reboundsPerGame: number;
  };
}

export const PlayerSchema = SchemaFactory.createForClass(Player); 