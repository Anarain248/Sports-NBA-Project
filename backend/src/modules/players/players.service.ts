import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createPlayerDto: CreatePlayerDto, userId: string): Promise<Player> {
    const createdPlayer = new this.playerModel({
      ...createPlayerDto,
      team: createPlayerDto.teamId,
      userId
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

  async findAll(userId: string): Promise<Player[]> {
    return this.playerModel.find({ userId })
      .populate('team')
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Player> {
    return this.playerModel.findOne({ _id: id, userId }).populate('team').exec();
  }

  async update(id: string, updatePlayerDto: CreatePlayerDto, userId: string): Promise<Player> {
    const player = await this.playerModel.findOne({ _id: id, userId });
    if (!player) {
      throw new NotFoundException('Player not found or unauthorized');
    }

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

  async remove(id: string, userId: string): Promise<Player> {
    const player = await this.playerModel.findOne({ _id: id, userId });
    if (!player) {
      throw new NotFoundException('Player not found or unauthorized');
    }
    
    await this.teamModel.updateMany(
      { players: id },
      { $pull: { players: id } }
    );
    return this.playerModel.findOneAndDelete({ _id: id, userId }).exec();
  }
} 