import { IsEnum } from 'class-validator';
import { StatusPeminjaman } from '@prisma/client';

export class UpdatePeminjamanDto {
  @IsEnum(StatusPeminjaman)
  status: StatusPeminjaman;
}
