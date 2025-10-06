import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { UsersService } from '../users/users.service';
export declare class BidsService {
    private readonly bidRepository;
    private readonly usersService;
    constructor(bidRepository: Repository<Bid>, usersService: UsersService);
    create(createBidDto: CreateBidDto): Promise<Bid>;
    findAll(): Promise<Bid[]>;
    findOne(id: number): Promise<Bid>;
    findByBidNumber(bidNumber: string): Promise<Bid>;
    update(id: number, updateBidDto: UpdateBidDto): Promise<Bid>;
    remove(id: number): Promise<void>;
    findByUser(userId: number): Promise<Bid[]>;
}
