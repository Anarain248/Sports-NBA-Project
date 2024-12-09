import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coach } from '../../schemas/coach.schema';
import { CreateCoachDto } from './dto/create-coach.dto';
import { Team } from '../../schemas/team.schema';

@Injectable()
export class CoachesService {
  constructor(
    @InjectModel(Coach.name) private readonly coachModel: Model<Coach>,
    @InjectModel('Team') private readonly teamModel: Model<Team>,
  ) {}

  async create(createCoachDto: CreateCoachDto): Promise<Coach> {
    const createdCoach = new this.coachModel({
      ...createCoachDto,
      team: createCoachDto.teamId
    });
    return (await createdCoach.save()).populate('team');
  }

  async findAll(): Promise<Coach[]> {
    return this.coachModel.find().populate('team').exec();
  }

  async findOne(id: string): Promise<Coach> {
    return this.coachModel.findById(id).populate('team').exec();
  }

  async update(id: string, updateCoachDto: CreateCoachDto): Promise<Coach> {
    const updateData = {
      ...updateCoachDto,
      team: updateCoachDto.teamId
    };

    // First, remove this coach from any previous team
    await this.teamModel.updateMany(
      { coach: id },
      { $unset: { coach: "" } }
    );

    // If there's a new team, update it with this coach
    if (updateCoachDto.teamId) {
      await this.teamModel.findByIdAndUpdate(
        updateCoachDto.teamId,
        { coach: id }
      );
    }

    return this.coachModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('team')
      .exec();
  }

  async remove(id: string): Promise<Coach> {
    // First, remove coach reference from team
    await this.teamModel.updateMany(
      { coach: id },
      { $unset: { coach: "" } }
    );
    return this.coachModel.findByIdAndDelete(id).exec();
  }
} 