import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Bid } from './entities/bid.entity';
export declare class BidsController {
    private readonly bidsService;
    constructor(bidsService: BidsService);
    create(createBidDto: CreateBidDto): Promise<Bid>;
    findAll(userId?: number): Promise<Bid[]>;
    findOne(id: number): Promise<Bid>;
    findByBidNumber(bidNumber: string): Promise<Bid>;
    update(id: number, updateBidDto: UpdateBidDto): Promise<Bid>;
    remove(id: number): Promise<void>;
}
