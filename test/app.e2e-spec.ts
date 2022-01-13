import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let appService = { 
    findAll: () => ['test'],
    find: () => ['test'],
    deletePair: () => ['test'],
    storePair: () => ['test'],
    storePairs: () => ['test']
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideProvider(AppService)
      .useValue(appService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET findAll', () => {
    return request(app.getHttpServer())
      .get('/findall')
      .expect(200)
      .expect(appService.findAll());
  });

  it('/GET find', () => {
    return request(app.getHttpServer())
      .get('/store/:key')
      .expect(200)
      .expect(appService.find());
  });

  it('/DELETE deletePair', () => {
    return request(app.getHttpServer())
      .delete('/store/:key')
      .expect(200)
  });

  it('/PUT storePair', () => {
    return request(app.getHttpServer())
      .put('/store/:key')
      .expect(200)
  })

  afterAll(async () => {
    await app.close();
  });
});
