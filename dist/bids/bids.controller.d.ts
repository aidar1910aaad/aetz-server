import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { CloneRepriceBidDto } from './dto/clone-reprice-bid.dto';
import { CalculateBidDto } from './dto/calculate-bid.dto';
import { Bid } from './entities/bid.entity';
export declare class BidsController {
    private readonly bidsService;
    constructor(bidsService: BidsService);
    create(createBidDto: CreateBidDto): Promise<Bid>;
    calculateDraft(dto: CalculateBidDto): Promise<{
        totalAmount: number;
        data: any;
    }>;
    findAll(userId?: number): Promise<Bid[]>;
    findOne(id: number): Promise<Bid>;
    findByBidNumber(bidNumber: string): Promise<Bid>;
    update(id: number, updateBidDto: UpdateBidDto): Promise<Bid>;
    cloneReprice(id: number, dto: CloneRepriceBidDto): Promise<Bid>;
    remove(id: number): Promise<void>;
}
