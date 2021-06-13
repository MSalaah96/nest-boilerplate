import { Module } from '@nestjs/common';
import { UserRepository } from './models/user/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class DatabaseModule {}
