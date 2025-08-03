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
    const userId = createBidDto.meta.user.id;
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const bid = this.bidRepository.create({
      ...createBidDto,
      user,
      userId,
    });

    return this.bidRepository.save(bid);
  }

  async findAll(): Promise<Bid[]> {
    return this.bidRepository.find({ relations: ['user'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Bid> {
    const bid = await this.bidRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
    return bid;
  }

  async update(id: number, updateBidDto: UpdateBidDto): Promise<Bid> {
    const bid = await this.findOne(id);

    if (
      updateBidDto.meta?.user?.id &&
      updateBidDto.meta.user.id !== bid.userId
    ) {
      const userId = updateBidDto.meta.user.id;
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      bid.user = user;
      bid.userId = userId;
    }

    const updatedBid = this.bidRepository.merge(bid, updateBidDto);

    return this.bidRepository.save(updatedBid);
  }

  async remove(id: number): Promise<void> {
    const result = await this.bidRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
  }
}
