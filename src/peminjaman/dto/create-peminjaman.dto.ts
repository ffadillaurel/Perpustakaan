import { IsInt } from 'class-validator';

export class CreatePeminjamanDto {
  @IsInt()
  studentId: number;

  @IsInt()
  bookId: number;
}
