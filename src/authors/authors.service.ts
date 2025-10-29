import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author, AuthorType } from './authors.repository';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author) private authorsRepository: Repository<Author>,
  ) {}
  // create an author
  async createAuthor(author: AuthorType): Promise<Author> {
    const newAuthor = this.authorsRepository.create(author);
    return await this.authorsRepository.save(newAuthor);
  }
  // read a single author or authors list
  // if there is an id that is a path param - fetch that author or return 404
  // if there is no id - look for query params, like ?search=, ?page=1 and ?limit=5

  async retrieveOne(id: string): Promise<Author> {
    const author = await this.authorsRepository.findOneBy({ id });
    if (!author) {
      throw new HttpException('Author Not Found', HttpStatus.NOT_FOUND);
    }
    return author;
  }
  async retrieveAll(page: number, limit: number, search?: string) {
    const query = this.authorsRepository.createQueryBuilder('author');
    if (search) {
      query.where(
        `author.firstName ILIKE :search OR author.lastName ILIKE :search`,
        { search: `%${search}%` },
      );
    }
    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('author.createdAt', 'DESC')
      .getManyAndCount();
    if (!total) {
      throw new HttpException('No Authors Found', HttpStatus.NOT_FOUND);
    }
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
