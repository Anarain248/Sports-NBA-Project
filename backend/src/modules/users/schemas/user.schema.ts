import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 'user' })
  role: string;

  @Prop({ type: Object, required: true })
  permissions: {
    teams: string[];
    players: string[];
    coaches: string[];
  };
}

export const UserSchema = SchemaFactory.createForClass(User); 