import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePengembalianDto } from './dto/create-pengembalian.dto';

@Injectable()
export class PengembalianService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePengembalianDto) {
    const pinjam = await this.prisma.peminjaman.findUnique({
      where: { id: dto.peminjamanId },
    });
    if (!pinjam) throw new NotFoundException('Peminjaman tidak ditemukan');

    if (pinjam.status === 'SELESAI')
      throw new BadRequestException('Buku sudah dikembalikan');

    await this.prisma.peminjaman.update({
      where: { id: dto.peminjamanId },
      data: { status: 'SELESAI' },
    });

    return this.prisma.pengembalian.create({
      data: { peminjamanId: dto.peminjamanId },
    });
  }

  findAll() {
    return this.prisma.pengembalian.findMany({
      include: {
        peminjaman: {
          include: { student: true, book: true },
        },
      },
      orderBy: { id: 'asc' },
    });
  }
}
