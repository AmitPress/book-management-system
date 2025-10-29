import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book, BookType } from './books.repository';
import { Repository } from 'typeorm';
import { Author } from 'src/authors/authors.repository';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    @InjectRepository(Author) private authorRepository: Repository<Author>,
  ) {}
  async createBook(book: BookType) {
    const { author, ...bookdetails } = book;
    const authorEntity = await this.authorRepository.findOneBy({ id: author });
    if (!authorEntity) {
      throw new HttpException('Author Not Found', HttpStatus.BAD_REQUEST);
    }
    const newBook = this.bookRepository.create({
      ...bookdetails,
      author: authorEntity,
    });
    return this.bookRepository.save(newBook);
  }
  async retrieveOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new HttpException('Book Not Found', HttpStatus.NOT_FOUND);
    }
    return book;
  }
  async retrieveAll(page: number, limit: number, search?: string) {
    const query = this.bookRepository.createQueryBuilder('book');
    if (search) {
      query.where(`book.title ILIKE :search`, { search: `%${search}%` });
    }
    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('book.createdAt', 'DESC')
      .getManyAndCount();
    if (!total) {
      throw new HttpException('No Books Found', HttpStatus.NOT_FOUND);
    }
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async deleteBook(id: string) {
    try {
      await this.bookRepository.delete({ id });
    } catch (e) {
      console.log(e);
      throw new HttpException('Book Not Found', HttpStatus.NOT_FOUND);
    }
  }
  async updateBook(id: string, payload: BookType) {
    const { author, ...bookdetails } = payload;
    const authorEntity = await this.authorRepository.findOneBy({ id: author });
    if (!authorEntity) {
      throw new HttpException('Author Not Found', HttpStatus.BAD_REQUEST);
    }
    const book = await this.bookRepository.preload({ id, ...bookdetails, author: authorEntity });
    if (!book) {
      throw new HttpException('Book Not Found', HttpStatus.NOT_FOUND);
    }
    return await this.bookRepository.save(book);
  }
}
