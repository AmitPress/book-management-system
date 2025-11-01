import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author, AuthorType } from './authors.repository';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let authorRepository: any;

  const authorDto = {
    firstName: 'amit',
    lastName: 'malaker',
    bio: 'a great poet',
    birthDate: new Date('2019-01-15'),
  };

  const mockAuthor = {
    id: uuidv4(),
    ...authorDto,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[mockAuthor], 1]),
  };

  const mockAuthorsRepository = {
    create: jest.fn().mockImplementation((authorsDto) => authorsDto),
    save: jest.fn().mockImplementation((author) =>
      Promise.resolve({ id: uuidv4(), ...author }),
    ),
    findOneBy: jest.fn().mockImplementation(({ id }) => ({ id, ...authorDto })),
    delete: jest.fn().mockImplementation(({ id }) => undefined),
    preload: jest.fn().mockImplementation(({ id, ...payload }) => ({
      id,
      ...authorDto,
      ...payload,
    })),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(Author),
          useValue: mockAuthorsRepository,
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    authorRepository = module.get(getRepositoryToken(Author));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAuthor', () => {
    it('should create an author and return that back', async () => {
      expect(await service.createAuthor(authorDto)).toEqual({
        id: expect.any(String),
        ...authorDto,
      });
      expect(authorRepository.create).toHaveBeenCalledWith(authorDto);
      expect(authorRepository.save).toHaveBeenCalled();
    });
  });

  describe('retrieveOne', () => {
    it('should retrieve one author successfully', async () => {
      const id = 'demo';
      const result = await service.retrieveOne(id);
      expect(result).toEqual({
        id,
        ...authorDto,
      });
      expect(authorRepository.findOneBy).toHaveBeenCalledWith({ id });
    });

    it('should throw error if author not found', async () => {
      const id = 'nonexistent';
      jest.spyOn(authorRepository, 'findOneBy').mockResolvedValue(null);
      
      await expect(service.retrieveOne(id)).rejects.toThrow(
        new HttpException('Author Not Found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('retrieveAll', () => {
    it('should return paginated authors successfully', async () => {
      const result = await service.retrieveAll(1, 10);
      expect(result).toEqual({
        data: [mockAuthor],
        total: 1,
        page: 1,
        lastPage: 1,
      });
    });

    it('should handle search parameter', async () => {
      const result = await service.retrieveAll(1, 10, 'amit');
      expect(result).toEqual({
        data: [mockAuthor],
        total: 1,
        page: 1,
        lastPage: 1,
      });
    });

    it('should throw error if no authors found', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await expect(service.retrieveAll(1, 10)).rejects.toThrow(
        new HttpException('No Authors Found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('deleteAuthor', () => {
    it('should delete the author successfully', async () => {
      const id = 'demo';
      await expect(service.deleteAuthor(id)).resolves.toBeUndefined();
      expect(authorRepository.delete).toHaveBeenCalledWith({ id });
    });

    it('should throw error if delete fails', async () => {
      const id = 'demo';
      jest.spyOn(authorRepository, 'delete').mockRejectedValue(new Error());
      
      await expect(service.deleteAuthor(id)).rejects.toThrow(
        new HttpException('Author Not Found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('updateAuthor', () => {
    it('should update the author successfully', async () => {
      const id = 'demo';
      const payload = {
        firstName: 'rahul',
      } as AuthorType;

      const result = await service.updateAuthor(id, payload);
      expect(result).toEqual({
        id,
        ...authorDto,
        ...payload,
      });
      expect(authorRepository.preload).toHaveBeenCalledWith({ id, ...payload });
      expect(authorRepository.save).toHaveBeenCalled();
    });

    it('should throw error if author not found for update', async () => {
      const id = 'nonexistent';
      const payload = {
        firstName: 'rahul',
      } as AuthorType;

      jest.spyOn(authorRepository, 'preload').mockResolvedValue(null);
      
      await expect(service.updateAuthor(id, payload)).rejects.toThrow(
        new HttpException('Author Not Found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
