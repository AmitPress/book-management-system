import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from '../src/authors/authors.repository';
import { v4 as uuidv4 } from "uuid"

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const authorDto = {
    firstName: "amit",
    lastName: "malaker",
    bio: "a great poet",
    birthDate: new Date("2019-01-15")
  };
  
  const mockAuthorRepository = {
    create: jest.fn().mockImplementation((authorsDto) => authorsDto),
    save: jest.fn().mockImplementation((author) => 
      Promise.resolve({ id: uuidv4(), ...author })
    ),
    findOneBy: jest.fn().mockImplementation(({ id }) => 
      Promise.resolve({ id, ...authorDto })
    ),
    find: jest.fn().mockImplementation(() => 
      Promise.resolve([{ id: uuidv4(), ...authorDto }])
    ),
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(getRepositoryToken(Author))
    .useValue(mockAuthorRepository)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // Create an author
  it('/authors (POST)', () => {
    return request(app.getHttpServer())
      .post('/authors')
      .send(authorDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.firstName).toBe(authorDto.firstName);
        expect(res.body.lastName).toBe(authorDto.lastName);
      });
  });

  // Get a specific author by ID
  it('/authors/:id (GET)', async () => {
    const testId = uuidv4();
    return request(app.getHttpServer())
      .get(`/authors/${testId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', testId);
        expect(res.body.firstName).toBe(authorDto.firstName);
      });
  });
});
