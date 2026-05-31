import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('BidsController (integration)', () => {
  let app: INestApplication;
  const bidsServiceMock = {
    cloneWithReprice: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByBidNumber: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [BidsController],
      providers: [
        {
          provide: BidsService,
          useValue: bidsServiceMock,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /bids/:id/clone-reprice creates repriced clone', async () => {
    bidsServiceMock.cloneWithReprice.mockResolvedValue({
      id: 15,
      bidNumber: 'AETZ – 2026 – 15',
      data: { repriceDiff: { delta: 120000 } },
      totalAmount: 5000000,
    });

    await request(app.getHttpServer())
      .post('/bids/10/clone-reprice')
      .send({ useCurrentDate: true })
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBe(15);
        expect(body.bidNumber).toBe('AETZ – 2026 – 15');
      });

    expect(bidsServiceMock.cloneWithReprice).toHaveBeenCalledWith(10, { useCurrentDate: true });
  });
});
