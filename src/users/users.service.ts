import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user ?? undefined;
  }
  
  async findById(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user ?? undefined;
  }
  
  

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async update(id: number, partialUser: Partial<User>): Promise<User> {
    if (!partialUser || Object.keys(partialUser).length === 0) {
      throw new Error('Нет данных для обновления');
    }
  
    await this.userRepository.update(id, partialUser);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('User not found after update');
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
