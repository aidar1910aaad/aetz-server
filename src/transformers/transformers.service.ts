import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transformer } from './entities/transformer.entity';
import { CreateTransformerDto } from './dto/create-transformer.dto';
import { UpdateTransformerDto } from './dto/update-transformer.dto';

@Injectable()
export class TransformersService {
  constructor(
    @InjectRepository(Transformer)
    private readonly transformerRepository: Repository<Transformer>,
  ) {}

  async create(createTransformerDto: CreateTransformerDto): Promise<Transformer> {
    const transformer = this.transformerRepository.create(createTransformerDto);
    return this.transformerRepository.save(transformer);
  }

  async findAll(): Promise<Transformer[]> {
    return this.transformerRepository.find({
      order: {
        model: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Transformer> {
    const transformer = await this.transformerRepository.findOne({ where: { id } });
    if (!transformer) {
      throw new NotFoundException(`Трансформатор с ID ${id} не найден`);
    }
    return transformer;
  }

  async update(id: number, updateTransformerDto: UpdateTransformerDto): Promise<Transformer> {
    const transformer = await this.findOne(id);
    Object.assign(transformer, updateTransformerDto);
    return this.transformerRepository.save(transformer);
  }

  async remove(id: number): Promise<void> {
    const transformer = await this.findOne(id);
    await this.transformerRepository.remove(transformer);
  }

  async findByVoltage(voltage: string): Promise<Transformer[]> {
    return this.transformerRepository.find({
      where: { voltage },
      order: {
        power: 'ASC',
      },
    });
  }

  async findByType(type: string): Promise<Transformer[]> {
    return this.transformerRepository.find({
      where: { type },
      order: {
        power: 'ASC',
      },
    });
  }

  async findByManufacturer(manufacturer: string): Promise<Transformer[]> {
    return this.transformerRepository.find({
      where: { manufacturer },
      order: {
        model: 'ASC',
      },
    });
  }
} 