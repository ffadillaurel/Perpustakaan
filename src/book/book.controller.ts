import { 
  Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards 
} from '@nestjs/common';
import { BooksService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('book')
// 💡 @UseGuards(JwtAuthGuard) DIHAPUS DARI SINI supaya tidak mengunci semua method
export class BookController {
  constructor(private readonly bookService: BooksService) { }

  // 🔒 HANYA ADMIN & PETUGAS (WAJIB LOGIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Post()
  @ApiOperation({ summary: 'Menambahkan buku (ADMIN & PETUGAS)' })
  create(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto);
  }

  // 🔓 PUBLIK (TIDAK PERLU LOGIN)
  @Get()
  @ApiOperation({ summary: 'Menampilkan seluruh data buku atau pencarian spesifik (Publik)' })
  @ApiQuery({ name: 'id', required: false, description: 'Kosongkan jika ingin ambil semua' })
  @ApiQuery({ name: 'title', required: false, description: 'Kosongkan jika ingin ambil semua' })
  findAll(
    @Query('id') id?: string,
    @Query('title') title?: string,
  ) {
    return this.bookService.findAll({ id, title });
  }

  // 🔓 PUBLIK (TIDAK PERLU LOGIN)
  @Get(':id')
  @ApiOperation({ summary: 'Menampilkan detail buku berdasarkan ID (Publik)' })
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(Number(id));
  }

  // 🔒 HANYA ADMIN & PETUGAS (WAJIB LOGIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @Put(':id')
  @ApiOperation({ summary: 'Mengupdate buku (ADMIN & PETUGAS)' })
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.bookService.update(Number(id), dto);
  }

  // 🔒 HANYA ADMIN (WAJIB LOGIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus buku (ADMIN only)' })
  remove(@Param('id') id: string) {
    return this.bookService.remove(Number(id));
  }
}