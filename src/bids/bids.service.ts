import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { UsersService } from '../users/users.service';
import { BidRepriceService } from './services/bid-reprice.service';
import { CloneRepriceBidDto } from './dto/clone-reprice-bid.dto';
import { BidPriceSourcesService } from './services/bid-price-sources.service';
import { CalculateBidDto } from './dto/calculate-bid.dto';
import {
  extractYearFromBidDate,
  formatBidNumber,
  parseAetzBidNumberSequence,
} from './utils/bid-number.util';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
    private readonly usersService: UsersService,
    private readonly bidPriceSourcesService: BidPriceSourcesService,
    private readonly bidRepriceService: BidRepriceService
  ) {}

  private normalizeBidData(data: any) {
    const normalized = data && typeof data === 'object' ? { ...data } : {};
    if (!normalized.config) {
      normalized.config = { ...normalized };
    }
    if (!normalized.snapshot) {
      normalized.snapshot = { ...normalized };
    }
    return normalized;
  }

  private async recalculateBidPayload(data: any, configOverrides?: Record<string, any>) {
    const normalizedData = this.normalizeBidData(data);
    const { materials, currencySettings, workPrices, bmzSettings, transformers, calculations } =
      await this.bidPriceSourcesService.loadCurrentSources();
    const priceMaps = this.bidRepriceService.buildPriceMaps(
      materials,
      currencySettings,
      workPrices,
      bmzSettings,
      transformers,
      calculations
    );
    return this.bidRepriceService.repriceBidData(normalizedData, priceMaps, configOverrides);
  }

  private async generateNextBidNumber(year: number): Promise<string> {
    const rows = await this.bidRepository
      .createQueryBuilder('bid')
      .select('bid.bidNumber', 'bidNumber')
      .where('bid.bidNumber LIKE :aetzPattern', {
        aetzPattern: `AETZ%${year}%`,
      })
      .getRawMany<{ bidNumber: string }>();

    let maxSequence = 0;
    for (const row of rows) {
      const sequence = parseAetzBidNumberSequence(row.bidNumber, year);
      if (sequence !== null && sequence > maxSequence) {
        maxSequence = sequence;
      }
    }

    return formatBidNumber(year, maxSequence + 1);
  }

  private async saveWithGeneratedBidNumber(bid: Bid): Promise<Bid> {
    const maxAttempts = 5;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (!bid.bidNumber) {
        const year = extractYearFromBidDate(bid.date);
        bid.bidNumber = await this.generateNextBidNumber(year);
      }

      try {
        return await this.bidRepository.save(bid);
      } catch (error: any) {
        const isUniqueViolation = error?.code === '23505';
        if (!isUniqueViolation || attempt === maxAttempts - 1) {
          throw error;
        }
        bid.bidNumber = '';
      }
    }

    throw new Error('Failed to assign a unique bid number');
  }

  private withNormalizedBidData<T extends Bid>(bid: T): T {
    bid.data = this.normalizeBidData(bid.data);
    const finalFromSnapshot = Number(bid.data?.snapshot?.totals?.finalTotal);
    if (finalFromSnapshot > 0) {
      bid.totalAmount = finalFromSnapshot;
    }
    return bid;
  }

  async create(createBidDto: CreateBidDto): Promise<Bid> {
    const userId = createBidDto.user.id;
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const shouldRecalculate = String(createBidDto.type || '')
      .toUpperCase()
      .includes('БКТП');
    const recalculated = shouldRecalculate
      ? await this.recalculateBidPayload(createBidDto.data)
      : {
          data: this.normalizeBidData(createBidDto.data),
          totalAmount: createBidDto.totalAmount ?? 0,
        };
    const bid = this.bidRepository.create({
      type: createBidDto.type,
      date: createBidDto.date,
      client: createBidDto.client,
      taskNumber: createBidDto.taskNumber,
      totalAmount: recalculated.totalAmount,
      data: recalculated.data,
      user: createBidDto.user,
      userEntity: user,
      userId: userId,
    });

    const saved = await this.saveWithGeneratedBidNumber(bid);
    return this.withNormalizedBidData(saved);
  }

  async findAll(): Promise<Bid[]> {
    const bids = await this.bidRepository.find({
      relations: ['userEntity'],
      order: { createdAt: 'DESC' },
    });
    return bids.map((bid) => this.withNormalizedBidData(bid));
  }

  async findOne(id: number): Promise<Bid> {
    const bid = await this.bidRepository.findOne({
      where: { id },
      relations: ['userEntity'],
    });
    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
    return this.withNormalizedBidData(bid);
  }

  async findByBidNumber(bidNumber: string): Promise<Bid> {
    const bid = await this.bidRepository.findOne({
      where: { bidNumber },
      relations: ['userEntity'],
    });
    if (!bid) {
      throw new NotFoundException(`Bid with number ${bidNumber} not found`);
    }
    return this.withNormalizedBidData(bid);
  }

  async update(id: number, updateBidDto: UpdateBidDto): Promise<Bid> {
    const bid = await this.findOne(id);

    // Обновляем только переданные поля
    if (updateBidDto.type !== undefined) {
      bid.type = updateBidDto.type;
    }
    if (updateBidDto.date !== undefined) {
      bid.date = updateBidDto.date;
    }
    if (updateBidDto.client !== undefined) {
      bid.client = updateBidDto.client;
    }
    if (updateBidDto.taskNumber !== undefined) {
      bid.taskNumber = updateBidDto.taskNumber;
    }
    if (updateBidDto.data !== undefined) {
      const shouldRecalculate = String(updateBidDto.type ?? bid.type ?? '')
        .toUpperCase()
        .includes('БКТП');
      if (shouldRecalculate) {
        const recalculated = await this.recalculateBidPayload(updateBidDto.data);
        bid.data = recalculated.data;
        bid.totalAmount = recalculated.totalAmount;
      } else {
        bid.data = this.normalizeBidData(updateBidDto.data);
      }
    } else if (updateBidDto.totalAmount !== undefined) {
      // Fallback for non-BKTP partial updates where data is unchanged
      bid.totalAmount = updateBidDto.totalAmount;
    }
    if (updateBidDto.user !== undefined) {
      bid.user = updateBidDto.user;

      // Обновляем связь с пользователем если изменился ID
      if (updateBidDto.user.id !== bid.userId) {
        const user = await this.usersService.findById(updateBidDto.user.id);
        if (!user) {
          throw new NotFoundException(`User with ID ${updateBidDto.user.id} not found`);
        }
        bid.userEntity = user;
        bid.userId = updateBidDto.user.id;
      }
    }

    const saved = await this.bidRepository.save(bid);
    return this.withNormalizedBidData(saved);
  }

  async cloneWithReprice(id: number, dto: CloneRepriceBidDto = {}): Promise<Bid> {
    const sourceBid = await this.findOne(id);
    const userId = sourceBid.user?.id || sourceBid.userId;
    if (!userId) {
      throw new NotFoundException(`User for source bid ${id} not found`);
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const repriced = await this.recalculateBidPayload(sourceBid.data, dto.configOverrides);

    const useCurrentDate = dto.useCurrentDate ?? true;
    const date =
      dto.date || (useCurrentDate ? new Date().toISOString().slice(0, 10) : sourceBid.date);
    const data = {
      ...repriced.data,
      originalBidId: sourceBid.id,
      notes: dto.notes ?? repriced.data?.notes,
      managerMarkupPercent: dto.managerMarkupPercent ?? repriced.data?.managerMarkupPercent,
    };

    const newBid = this.bidRepository.create({
      type: sourceBid.type,
      date,
      client: dto.client || sourceBid.client,
      taskNumber: dto.taskNumber || sourceBid.taskNumber,
      totalAmount: repriced.totalAmount,
      data,
      user: sourceBid.user,
      userEntity: user,
      userId: user.id,
    });

    const saved = await this.saveWithGeneratedBidNumber(newBid);
    return this.withNormalizedBidData(saved);
  }

  async calculateDraft(dto: CalculateBidDto): Promise<{ totalAmount: number; data: any }> {
    const type = String(dto?.type || '').toUpperCase();
    const isBKTP = type.includes('БКТП') || !type;
    if (!isBKTP) {
      return {
        totalAmount:
          this.normalizeBidData(dto?.data)?.snapshot?.totals?.finalTotal ??
          this.normalizeBidData(dto?.data)?.snapshot?.totals?.grandTotal ??
          0,
        data: this.normalizeBidData(dto?.data),
      };
    }

    const recalculated = await this.recalculateBidPayload(dto?.data);
    return {
      totalAmount: recalculated.totalAmount,
      data: recalculated.data,
    };
  }

  async remove(id: number): Promise<void> {
    const result = await this.bidRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
  }

  async findByUser(userId: number): Promise<Bid[]> {
    return this.bidRepository.find({
      where: { userId },
      relations: ['userEntity'],
      order: { createdAt: 'DESC' },
    });
  }
}
