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
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('teams')
// @UseGuards(JwtAuthGuard)  // Uncomment when auth is implemented
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll(@Query() query: any) {
    try {
      return await this.teamsService.findAll(query);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const team = await this.teamsService.findOne(id);
      if (!team) {
        throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
      }
      return team;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    try {
      return await this.teamsService.create(createTeamDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    try {
      const team = await this.teamsService.update(id, updateTeamDto);
      if (!team) {
        throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
      }
      return team;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const team = await this.teamsService.remove(id);
      if (!team) {
        throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
      }
      return team;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id/players')
  async getTeamPlayers(@Param('id') id: string) {
    try {
      return await this.teamsService.getTeamPlayers(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id/coach')
  async getTeamCoach(@Param('id') id: string) {
    try {
      return await this.teamsService.getTeamCoach(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
} 