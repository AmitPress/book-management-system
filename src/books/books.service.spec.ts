import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book, Genre } from './books.repository';
import { Author } from '../authors/authors.repository';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let bookRepository: Repository<Book>;
  let authorRepository: Repository<Author>;

  const mockBook = {
    id: '1',
    title: 'Test Book',
    isbn: '1234567890',
    publishedDate: new Date(),
    genre: Genre.Fantasy,
    author: { id: '1', name: 'Test Author' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthor = {
    id: '1',
    name: 'Test Author',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            create: jest.fn().mockReturnValue(mockBook),
            save: jest.fn().mockResolvedValue(mockBook),
            findOneBy: jest.fn().mockResolvedValue(mockBook),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockResolvedValue([[mockBook], 1]),
            })),
            preload: jest.fn().mockResolvedValue(mockBook),
          },
        },
        {
          provide: getRepositoryToken(Author),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockAuthor),
          },
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    authorRepository = module.get<Repository<Author>>(getRepositoryToken(Author));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBook', () => {
    it('should create a new book successfully', async () => {
      const bookDto = {
        title: 'Test Book',
        isbn: '1234567890',
        publishedDate: '2023-01-01',
        genre: Genre.Fantasy,
        author: '1',
      };

      const result = await service.createBook(bookDto);
      expect(result).toEqual(mockBook);
    });

    it('should throw error if author not found', async () => {
      jest.spyOn(authorRepository, 'findOneBy').mockResolvedValue(null);
      const bookDto = {
        title: 'Test Book',
        isbn: '1234567890',
        publishedDate: '2023-01-01',
        genre: Genre.Fantasy,
        author: '1',
      };

      await expect(service.createBook(bookDto)).rejects.toThrow(
        new HttpException('Author Not Found', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('retrieveOne', () => {
    it('should return a book successfully', async () => {
      const result = await service.retrieveOne('1');
      expect(result).toEqual(mockBook);
    });

    it('should throw error if book not found', async () => {
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValue(null);
      await expect(service.retrieveOne('1')).rejects.toThrow(
        new HttpException('Book Not Found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('retrieveAll', () => {
    it('should return paginated books successfully', async () => {
      const result = await service.retrieveAll(1, 10);
      expect(result).toEqual({
        data: [mockBook],
        total: 1,
        page: 1,
        lastPage: 1,
      });
    });

    it('should handle search parameter', async () => {
      const result = await service.retrieveAll(1, 10, 'Test');
      expect(result).toEqual({
        data: [mockBook],
        total: 1,
        page: 1,
        lastPage: 1,
      });
    });
  });

  describe('deleteBook', () => {
    it('should delete a book successfully', async () => {
      await expect(service.deleteBook('1')).resolves.not.toThrow();
    });

    it('should throw error if delete fails', async () => {
      jest.spyOn(bookRepository, 'delete').mockRejectedValue(new Error());
      await expect(service.deleteBook('1')).rejects.toThrow(
        new HttpException('Book Not Found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('updateBook', () => {
    it('should update a book successfully', async () => {
      const bookDto = {
        title: 'Updated Book',
        isbn: '1234567890',
        publishedDate: '2023-01-01',
        genre: Genre.Fantasy,
        author: '1',
      };

      const result = await service.updateBook('1', bookDto);
      expect(result).toEqual(mockBook);
    });

    it('should throw error if author not found', async () => {
      jest.spyOn(authorRepository, 'findOneBy').mockResolvedValue(null);
      const bookDto = {
        title: 'Updated Book',
        isbn: '1234567890',
        publishedDate: '2023-01-01',
        genre: Genre.Fantasy,
        author: '1',
      };

      await expect(service.updateBook('1', bookDto)).rejects.toThrow(
        new HttpException('Author Not Found', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw error if book not found', async () => {
      jest.spyOn(bookRepository, 'preload').mockResolvedValue(undefined);
      const bookDto = {
        title: 'Updated Book',
        isbn: '1234567890',
        publishedDate: '2023-01-01',
        genre: Genre.Fantasy,
        author: '1',
      };

      await expect(service.updateBook('1', bookDto)).rejects.toThrow(
        new HttpException('Book Not Found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
