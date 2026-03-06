import { IsInt } from 'class-validator';

export class CreatePengembalianDto {
  @IsInt()
  peminjamanId: number;
}
