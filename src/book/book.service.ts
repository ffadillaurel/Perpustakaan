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

    if (filter?.id) {
      where.id = Number(filter.id);
    }

    if (filter?.title) {
      where.title = {
        contains: filter.title, 
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