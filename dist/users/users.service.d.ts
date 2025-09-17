import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(dto: CreateUserDto): Promise<User>;
    findByUsername(username: string): Promise<User | undefined>;
    findById(id: number): Promise<User | undefined>;
    findAll(): Promise<User[]>;
    update(id: number, partialUser: Partial<User>): Promise<User>;
    remove(id: number): Promise<void>;
}
