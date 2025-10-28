import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author, AuthorType } from './authors.repository';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorsService {
    constructor(@InjectRepository(Author) private authorsRepository: Repository<Author>){}
    // create an author
    createAuthor(author: AuthorType){
        const newAuthor = this.authorsRepository.create(author);
        return this.authorsRepository.save(newAuthor);
    }
}
