import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team } from '../../schemas/team.schema';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
  ) {}

  private async checkDuplicateTeam(name: string, userId: string, excludeId?: string): Promise<void> {
    const query = {
      name: { $regex: new RegExp(`^${name}$`, 'i') },  // Case-insensitive match
      userId: userId  // Add userId to the query
    };

    if (excludeId) {
      Object.assign(query, { _id: { $ne: excludeId } });
    }

    const existingTeam = await this.teamModel.findOne(query);
    
    if (existingTeam) {
      throw new ConflictException(`You already have a team named "${name}"`);
    }
  }

  async findAll(userId: string): Promise<Team[]> {
    const teams = await this.teamModel.find({ userId })
      .populate({
        path: 'coach',
        select: 'firstName lastName experience specialization'
      })
      .exec();
    return teams;
  }

  async findOne(id: string, userId: string): Promise<Team> {
    return this.teamModel
      .findOne({ _id: id, userId })
      .populate('coach')
      .populate('players')
      .exec();
  }

  async create(createTeamDto: CreateTeamDto, userId: string): Promise<Team> {
    await this.checkDuplicateTeam(createTeamDto.name, userId);
    const createdTeam = new this.teamModel({
      ...createTeamDto,
      userId
    });
    return createdTeam.save();
  }

  async update(id: string, updateTeamDto: UpdateTeamDto, userId: string): Promise<Team> {
    const team = await this.teamModel.findOne({ _id: id, userId });
    if (!team) {
      throw new NotFoundException('Team not found or unauthorized');
    }
    if (updateTeamDto.name) {
      await this.checkDuplicateTeam(updateTeamDto.name, userId, id);
    }
    return this.teamModel
      .findByIdAndUpdate(id, updateTeamDto, { new: true })
      .exec();
  }

  async remove(id: string, userId: string): Promise<Team> {
    return this.teamModel.findOneAndDelete({ _id: id, userId }).exec();
  }

  async getTeamPlayers(id: string, userId: string) {
    const team = await this.teamModel
      .findOne({ _id: id, userId })
      .populate('players')
      .exec();
    return team?.players || [];
  }

  async getTeamCoach(id: string, userId: string) {
    const team = await this.teamModel
      .findOne({ _id: id, userId })
      .populate('coach')
      .exec();
    return team?.coach || null;
  }
}