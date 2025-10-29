import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book, BookType } from './books.repository';
import { Repository } from 'typeorm';
import { Author } from 'src/authors/authors.repository';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book) private bookRepository : Repository<Book>,
        @InjectRepository(Author) private authorRepository : Repository<Author>
    ){}
    async createBook(book: BookType){
        const {author, ...bookdetails} = book;
        const authorEntity = await this.authorRepository.findOneBy({id: author})
        if(!authorEntity){
            throw new HttpException(
                "Author Not Found",
                HttpStatus.BAD_REQUEST
            )
        }
        const newBook = this.bookRepository.create({...bookdetails, author: authorEntity});
        return this.bookRepository.save(newBook);
    }
}
