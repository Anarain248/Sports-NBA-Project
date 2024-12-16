import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll(@Request() req) {
    try {
      return await this.teamsService.findAll(req.user.sub);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      return await this.teamsService.findOne(id, req.user.sub);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  @Roles('admin')
  async create(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    try {
      return await this.teamsService.create(createTeamDto, req.user.sub);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto, @Request() req) {
    try {
      return await this.teamsService.update(id, updateTeamDto, req.user.sub);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string, @Request() req) {
    try {
      return await this.teamsService.remove(id, req.user.sub);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id/players')
  async getTeamPlayers(@Param('id') id: string, @Request() req) {
    try {
      return await this.teamsService.getTeamPlayers(id, req.user.sub);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id/coach')
  async getTeamCoach(@Param('id') id: string, @Request() req) {
    try {
      return await this.teamsService.getTeamCoach(id, req.user.sub);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
} 