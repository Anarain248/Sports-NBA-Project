import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async createUser(username: string, password: string, role: string = 'user'): Promise<UserDocument> {
    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const permissions = {
      teams: ['create', 'read', 'update', 'delete'],
      players: ['create', 'read', 'update', 'delete'],
      coaches: ['create', 'read', 'update', 'delete']
    };

    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      role,
      permissions
    });
    return newUser.save();
  }
} 