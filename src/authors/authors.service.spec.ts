import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author, AuthorType } from './authors.repository';
import {v4 as uuidv4} from "uuid"
import { HttpException, HttpStatus } from '@nestjs/common';
describe('AuthorsService', () => {
  let service: AuthorsService;
  const authorDto = {firstName: "amit", lastName: "malaker", bio: "a great poet", birthDate: new Date("2019-01-15")};
  const mockAuthorsRepository = {
    create: jest.fn().mockImplementation((authorsDto)=>authorsDto),
    save: jest.fn().mockImplementation((author)=>Promise.resolve({id: uuidv4(), ...author})),
    findOneBy: jest.fn().mockImplementation(({id})=>({id, ...authorDto})),
    delete: jest.fn().mockImplementation(({id}) => undefined),
    preload: jest.fn().mockImplementation(({id, ...payload})=>{
      return {
        id,
        ...authorDto,
        ...payload
      }
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(Author),
          useValue: mockAuthorsRepository
        }
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it("should create an author and return that back", async ()=>{
    expect(await service.createAuthor(authorDto)).toEqual({
      id: expect.any(String),
      ...authorDto
    })
  })
  it("should retrieve on author", async ()=>{
    const id = "demo";
    expect(await service.retrieveOne(id)).toEqual({
      id,
      ...authorDto
    })
  })
  it("should delete the author", async ()=>{
    const id = "demo";
    expect(await service.deleteAuthor(id)).toBeUndefined()
  })
  it("should update the author", async ()=>{
    const id = "demo";
    const payload = {
      firstName: "rahul"
    } as AuthorType
    expect(await service.updateAuthor(id, payload)).toEqual({
      id,
      ...authorDto,
      ...payload
    })
  })
});
