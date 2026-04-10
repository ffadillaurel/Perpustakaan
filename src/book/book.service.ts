import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateBookDto) {
    return this.prisma.book.create({ data: dto });
  }

  async findAll(filter?: { id?: string; title?: string }) {
    const where: any = {};

    // Perbaikan: Hanya tambahkan ke filter jika ada isinya dan bukan string kosong
    if (filter?.id && filter.id.trim() !== '') {
      const parsedId = Number(filter.id);
      if (!isNaN(parsedId)) {
        where.id = parsedId;
      }
    }

    if (filter?.title && filter.title.trim() !== '') {
      where.title = {
        contains: filter.title, // Mencari judul yang mengandung kata tersebut (Case Insensitive di MySQL)
      };
    }

    return this.prisma.book.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id }
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: number, dto: UpdateBookDto) {
    await this.findOne(id);
    return this.prisma.book.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.book.delete({ where: { id } });
    return { message: `Book with id ${id} deleted` };
  }
}