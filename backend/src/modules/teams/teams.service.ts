import { Injectable, ConflictException } from '@nestjs/common';
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

  private async checkDuplicateTeam(name: string, excludeId?: string): Promise<void> {
    const query = {
      name: { $regex: new RegExp(`^${name}$`, 'i') }  // Case-insensitive match
    };

    if (excludeId) {
      Object.assign(query, { _id: { $ne: excludeId } });
    }

    const existingTeam = await this.teamModel.findOne(query);
    
    if (existingTeam) {
      throw new ConflictException(`A team named "${name}" already exists`);
    }
  }

  async findAll(query: any): Promise<Team[]> {
    const { search, conference, ...rest } = query;
    let filter: any = { ...rest };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    if (conference) {
      filter.conference = conference;
    }

    return this.teamModel
      .find(filter)
      .populate('coach')
      .populate('players')
      .exec();
  }

  async findOne(id: string): Promise<Team> {
    return this.teamModel
      .findById(id)
      .populate('coach')
      .populate('players')
      .exec();
  }

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    await this.checkDuplicateTeam(createTeamDto.name);
    const createdTeam = new this.teamModel(createTeamDto);
    return createdTeam.save();
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    if (updateTeamDto.name) {
      await this.checkDuplicateTeam(updateTeamDto.name, id);
    }
    return this.teamModel
      .findByIdAndUpdate(id, updateTeamDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Team> {
    return this.teamModel.findByIdAndDelete(id).exec();
  }

  async getTeamPlayers(id: string) {
    const team = await this.teamModel
      .findById(id)
      .populate('players')
      .exec();
    return team?.players || [];
  }

  async getTeamCoach(id: string) {
    const team = await this.teamModel
      .findById(id)
      .populate('coach')
      .exec();
    return team?.coach || null;
  }
}