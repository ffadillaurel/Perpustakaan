import { Module } from '@nestjs/common';
import { BooksService } from './book.service';
import { BookController } from './book.controller';

@Module({
  providers: [BooksService],
  controllers: [BookController],
})
export class BookModule {}
