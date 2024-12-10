import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    try {
      return await this.playersService.create(createPlayerDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.playersService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const player = await this.playersService.findOne(id);
      if (!player) {
        throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
      }
      return player;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlayerDto: CreatePlayerDto) {
    try {
      const player = await this.playersService.update(id, updatePlayerDto);
      if (!player) {
        throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
      }
      return player;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const player = await this.playersService.remove(id);
      if (!player) {
        throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
      }
      return player;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
} 