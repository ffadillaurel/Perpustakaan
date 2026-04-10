import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { UpdatePeminjamanDto } from './dto/update-peminjaman.dto';

@Injectable()
export class PeminjamanService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePeminjamanDto) {
    const student = await this.prisma.student.findUnique({ where: { id: dto.studentId } });
    if (!student) throw new NotFoundException('Student tidak ditemukan');

    const book = await this.prisma.book.findUnique({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Book tidak ditemukan');

    const masihDipinjam = await this.prisma.peminjaman.findFirst({
      where: { bookId: dto.bookId, status: 'DIPINJAM' },
    });
    if (masihDipinjam) throw new BadRequestException('Buku ini sedang dalam status DIPINJAM');

    return this.prisma.peminjaman.create({ data: dto });
  }

  async findAll(tanggal?: string) {
    const where: any = {};

    // PERBAIKAN: Cek apakah tanggal ada dan tidak kosong
    if (tanggal && tanggal.trim() !== '') {
      const startDate = new Date(tanggal);
      const endDate = new Date(tanggal);
      endDate.setDate(endDate.getDate() + 1);

      where.tanggalPinjam = {
        gte: startDate,
        lt: endDate,
      };
    }

    return this.prisma.peminjaman.findMany({
      where,
      include: {
        student: true,
        book: true,
        pengembalian: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const data = await this.prisma.peminjaman.findUnique({
      where: { id },
      include: { student: true, book: true, pengembalian: true },
    });
    if (!data) throw new NotFoundException('Data peminjaman tidak ditemukan');
    return data;
  }

  async update(id: number, dto: UpdatePeminjamanDto) {
    await this.findOne(id);
    return this.prisma.peminjaman.update({ where: { id }, data: dto });
  }
}