import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Coach extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  experience: number;

  @Prop()
  specialization: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Team' })
  team: MongooseSchema.Types.ObjectId;
}

export const CoachSchema = SchemaFactory.createForClass(Coach); 