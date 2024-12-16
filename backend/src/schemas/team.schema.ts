import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Team extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true, enum: ['Eastern', 'Western'] })
  conference: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Coach' })
  coach: MongooseSchema.Types.ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Player' }] })
  players: MongooseSchema.Types.ObjectId[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
