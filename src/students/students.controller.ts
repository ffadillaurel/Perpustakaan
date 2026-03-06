import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'; // Tambahkan ini

@ApiTags('Students') // Tambahkan ini
@ApiBearerAuth()     // WAJIB: Supaya ikon gembok muncul dan token dikirim
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')

export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // 🔎 ADMIN + PETUGAS boleh lihat semua student
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  // 🔎 ADMIN + PETUGAS boleh lihat by id
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(Number(id));
  }

  // 🔎 ADMIN + PETUGAS boleh lihat by NIS
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Get('nis/:nis')
  findByNis(@Param('nis') nis: string) {
    return this.studentsService.findByNis(nis);
  }

  // 🔥 ADMIN ONLY
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Roles(UserRole.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(Number(id), dto);
  }

  @Roles(UserRole.ADMIN)
  @Put('nis/:nis')
  updateByNis(@Param('nis') nis: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.updateByNis(nis, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(Number(id));
  }

  @Roles(UserRole.ADMIN)
  @Delete('nis/:nis')
  removeByNis(@Param('nis') nis: string) {
    return this.studentsService.removeByNis(nis);
  }
}
