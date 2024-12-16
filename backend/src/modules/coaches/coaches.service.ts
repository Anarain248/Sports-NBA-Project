import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createCoachDto: CreateCoachDto, userId: string): Promise<Coach> {
    const createdCoach = new this.coachModel({
      ...createCoachDto,
      team: createCoachDto.teamId,
      userId
    });
    const savedCoach = await createdCoach.save();
    
    // Update the team with the new coach
    if (createCoachDto.teamId) {
      await this.teamModel.findByIdAndUpdate(
        createCoachDto.teamId,
        { coach: savedCoach._id }
      );
    }
    
    return savedCoach.populate('team');
  }

  async findAll(userId: string): Promise<Coach[]> {
    return this.coachModel.find({ userId })
      .populate('team')
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Coach> {
    return this.coachModel.findOne({ _id: id, userId }).populate('team').exec();
  }

  async update(id: string, updateCoachDto: CreateCoachDto, userId: string): Promise<Coach> {
    const coach = await this.coachModel.findOne({ _id: id, userId });
    if (!coach) {
      throw new NotFoundException('Coach not found or unauthorized');
    }

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

  async remove(id: string, userId: string): Promise<Coach> {
    const coach = await this.coachModel.findOne({ _id: id, userId });
    if (!coach) {
      throw new NotFoundException('Coach not found or unauthorized');
    }

    await this.teamModel.updateMany(
      { coach: id },
      { $unset: { coach: "" } }
    );
    return this.coachModel.findOneAndDelete({ _id: id, userId }).exec();
  }
} 