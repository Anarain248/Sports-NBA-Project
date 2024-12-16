import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('players')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto, @Request() req) {
    try {
      return await this.playersService.create(createPlayerDto, req.user.sub);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Request() req) {
    try {
      return await this.playersService.findAll(req.user.sub);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      const player = await this.playersService.findOne(id, req.user.sub);
      if (!player) {
        throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
      }
      return player;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlayerDto: CreatePlayerDto, @Request() req) {
    try {
      const player = await this.playersService.update(id, updatePlayerDto, req.user.sub);
      if (!player) {
        throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
      }
      return player;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    try {
      const player = await this.playersService.remove(id, req.user.sub);
      if (!player) {
        throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
      }
      return player;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
} 