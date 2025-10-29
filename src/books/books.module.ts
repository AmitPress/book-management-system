import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books.repository';
import { Author } from 'src/authors/authors.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
