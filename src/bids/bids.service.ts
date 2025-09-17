import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
    private readonly usersService: UsersService,
  ) {}

  async create(createBidDto: CreateBidDto): Promise<Bid> {
    const userId = createBidDto.user.id;
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const bid = this.bidRepository.create({
      type: createBidDto.type,
      date: createBidDto.date,
      client: createBidDto.client,
      taskNumber: createBidDto.taskNumber,
      totalAmount: createBidDto.totalAmount,
      data: createBidDto.data,
      user: createBidDto.user,
      userEntity: user,
      userId: userId,
    });

    return this.bidRepository.save(bid);
  }

  async findAll(): Promise<Bid[]> {
    return this.bidRepository.find({ 
      relations: ['userEntity'], 
      order: { createdAt: 'DESC' } 
    });
  }

  async findOne(id: number): Promise<Bid> {
    const bid = await this.bidRepository.findOne({
      where: { id },
      relations: ['userEntity'],
    });
    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
    return bid;
  }

  async findByBidNumber(bidNumber: string): Promise<Bid> {
    const bid = await this.bidRepository.findOne({
      where: { bidNumber },
      relations: ['userEntity'],
    });
    if (!bid) {
      throw new NotFoundException(`Bid with number ${bidNumber} not found`);
    }
    return bid;
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
    if (updateBidDto.totalAmount !== undefined) {
      bid.totalAmount = updateBidDto.totalAmount;
    }
    if (updateBidDto.data !== undefined) {
      bid.data = updateBidDto.data;
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

    return this.bidRepository.save(bid);
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
      order: { createdAt: 'DESC' }
    });
  }
}
