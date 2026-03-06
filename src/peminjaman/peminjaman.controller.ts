import { Controller, Get, Post, Body, Param, Put, Query, UseGuards } from '@nestjs/common';
import { PeminjamanService } from './peminjaman.service';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { UpdatePeminjamanDto } from './dto/update-peminjaman.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

// Pastikan import Swagger ini ada
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Peminjaman')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
// Pastikan baris di bawah ini ada dan tidak typo!
@Controller('peminjaman') 
export class PeminjamanController {
  constructor(private readonly service: PeminjamanService) {}

  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Post()
  @ApiOperation({ summary: 'Tambah peminjaman baru' })
  create(@Body() dto: CreatePeminjamanDto) {
    return this.service.create(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Get()
  @ApiOperation({ summary: 'Lihat semua peminjaman' })
  findAll(@Query('tanggal') tanggal?: string) {
    return this.service.findAll(tanggal);
  }

  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePeminjamanDto) {
    return this.service.update(Number(id), dto);
  }
}