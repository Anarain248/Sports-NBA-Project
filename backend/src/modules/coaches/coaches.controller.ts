import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('coaches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Post()
  async create(@Body() createCoachDto: CreateCoachDto, @Request() req) {
    try {
      return await this.coachesService.create(createCoachDto, req.user.sub);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Request() req) {
    try {
      return await this.coachesService.findAll(req.user.sub);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      const coach = await this.coachesService.findOne(id, req.user.sub);
      if (!coach) {
        throw new HttpException('Coach not found', HttpStatus.NOT_FOUND);
      }
      return coach;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCoachDto: CreateCoachDto, @Request() req) {
    try {
      const coach = await this.coachesService.update(id, updateCoachDto, req.user.sub);
      if (!coach) {
        throw new HttpException('Coach not found', HttpStatus.NOT_FOUND);
      }
      return coach;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    try {
      const coach = await this.coachesService.remove(id, req.user.sub);
      if (!coach) {
        throw new HttpException('Coach not found', HttpStatus.NOT_FOUND);
      }
      return coach;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
} 