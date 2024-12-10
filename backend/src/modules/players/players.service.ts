import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from '../../schemas/player.schema';
import { Team } from '../../schemas/team.schema';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
    @InjectModel('Team') private readonly teamModel: Model<Team>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const createdPlayer = new this.playerModel({
      ...createPlayerDto,
      team: createPlayerDto.teamId
    });
    const player = await createdPlayer.save();
    
    if (createPlayerDto.teamId) {
      await this.teamModel.findByIdAndUpdate(
        createPlayerDto.teamId,
        { $push: { players: player._id } }
      );
    }
    
    return player.populate('team');
  }

  async findAll(): Promise<Player[]> {
    return this.playerModel.find().populate('team').exec();
  }

  async findOne(id: string): Promise<Player> {
    return this.playerModel.findById(id).populate('team').exec();
  }

  async update(id: string, updatePlayerDto: CreatePlayerDto): Promise<Player> {
    // Remove player from old team
    await this.teamModel.updateMany(
      { players: id },
      { $pull: { players: id } }
    );

    // Add player to new team if teamId is provided
    if (updatePlayerDto.teamId) {
      await this.teamModel.findByIdAndUpdate(
        updatePlayerDto.teamId,
        { $push: { players: id } }
      );
    }

    const updateData = {
      ...updatePlayerDto,
      team: updatePlayerDto.teamId
    };

    return this.playerModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('team')
      .exec();
  }

  async remove(id: string): Promise<Player> {
    // Remove player from team
    await this.teamModel.updateMany(
      { players: id },
      { $pull: { players: id } }
    );
    return this.playerModel.findByIdAndDelete(id).exec();
  }
} 