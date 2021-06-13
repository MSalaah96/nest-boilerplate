import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ trim: true })
  name: string;

  @Prop({
    trim: true,
    unique: true,
  })
  email: string;

  @Prop({
    trim: true,
    unique: true,
  })
  mobile: string;

  @Prop()
  role: string;

  @Prop()
  password: string;

  @Prop()
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
