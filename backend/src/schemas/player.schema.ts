import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Player extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  jerseyNumber: number;

  @Prop()
  height: string;

  @Prop()
  weight: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Team' })
  team: MongooseSchema.Types.ObjectId;
}

export const PlayerSchema = SchemaFactory.createForClass(Player); 