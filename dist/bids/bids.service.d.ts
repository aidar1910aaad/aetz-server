import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { UsersService } from '../users/users.service';
import { BidRepriceService } from './services/bid-reprice.service';
import { CloneRepriceBidDto } from './dto/clone-reprice-bid.dto';
import { BidPriceSourcesService } from './services/bid-price-sources.service';
import { CalculateBidDto } from './dto/calculate-bid.dto';
export declare class BidsService {
    private readonly bidRepository;
    private readonly usersService;
    private readonly bidPriceSourcesService;
    private readonly bidRepriceService;
    constructor(bidRepository: Repository<Bid>, usersService: UsersService, bidPriceSourcesService: BidPriceSourcesService, bidRepriceService: BidRepriceService);
    private normalizeBidData;
    private recalculateBidPayload;
    private generateNextBidNumber;
    private saveWithGeneratedBidNumber;
    private withNormalizedBidData;
    create(createBidDto: CreateBidDto): Promise<Bid>;
    findAll(): Promise<Bid[]>;
    findOne(id: number): Promise<Bid>;
    findByBidNumber(bidNumber: string): Promise<Bid>;
    update(id: number, updateBidDto: UpdateBidDto): Promise<Bid>;
    cloneWithReprice(id: number, dto?: CloneRepriceBidDto): Promise<Bid>;
    calculateDraft(dto: CalculateBidDto): Promise<{
        totalAmount: number;
        data: any;
    }>;
    remove(id: number): Promise<void>;
    findByUser(userId: number): Promise<Bid[]>;
}
