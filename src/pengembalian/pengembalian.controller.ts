import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { PengembalianService } from './pengembalian.service';
import { CreatePengembalianDto } from './dto/create-pengembalian.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Pengembalian') // Tambahkan ini
@ApiBearerAuth()        // Tambahkan ini
@Controller('pengembalian')

export class PengembalianController {
  constructor(private readonly service: PengembalianService) {}

  // 🔒 HANYA PETUGAS & ADMIN BOLEH INPUT PENGEMBALIAN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Post()
  create(@Body() dto: CreatePengembalianDto) {
    return this.service.create(dto);
  }

  // 🔒 DATA PENGEMBALIAN HANYA BOLEH DILIHAT PETUGAS & ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Get()
  findAll() {
    return this.service.findAll();
  }
}
