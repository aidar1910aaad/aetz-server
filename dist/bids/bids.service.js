"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bid_entity_1 = require("./entities/bid.entity");
const users_service_1 = require("../users/users.service");
const bid_reprice_service_1 = require("./services/bid-reprice.service");
const bid_price_sources_service_1 = require("./services/bid-price-sources.service");
const bid_number_util_1 = require("./utils/bid-number.util");
let BidsService = class BidsService {
    constructor(bidRepository, usersService, bidPriceSourcesService, bidRepriceService) {
        this.bidRepository = bidRepository;
        this.usersService = usersService;
        this.bidPriceSourcesService = bidPriceSourcesService;
        this.bidRepriceService = bidRepriceService;
    }
    normalizeBidData(data) {
        const normalized = data && typeof data === 'object' ? { ...data } : {};
        if (!normalized.config) {
            normalized.config = { ...normalized };
        }
        if (!normalized.snapshot) {
            normalized.snapshot = { ...normalized };
        }
        return normalized;
    }
    async recalculateBidPayload(data, configOverrides) {
        const normalizedData = this.normalizeBidData(data);
        const { materials, currencySettings, workPrices, bmzSettings, transformers, calculations } = await this.bidPriceSourcesService.loadCurrentSources();
        const priceMaps = this.bidRepriceService.buildPriceMaps(materials, currencySettings, workPrices, bmzSettings, transformers, calculations);
        return this.bidRepriceService.repriceBidData(normalizedData, priceMaps, configOverrides);
    }
    async generateNextBidNumber(year) {
        const rows = await this.bidRepository
            .createQueryBuilder('bid')
            .select('bid.bidNumber', 'bidNumber')
            .where('bid.bidNumber LIKE :aetzPattern', {
            aetzPattern: `AETZ%${year}%`,
        })
            .getRawMany();
        let maxSequence = 0;
        for (const row of rows) {
            const sequence = (0, bid_number_util_1.parseAetzBidNumberSequence)(row.bidNumber, year);
            if (sequence !== null && sequence > maxSequence) {
                maxSequence = sequence;
            }
        }
        return (0, bid_number_util_1.formatBidNumber)(year, maxSequence + 1);
    }
    async saveWithGeneratedBidNumber(bid) {
        const maxAttempts = 5;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            if (!bid.bidNumber) {
                const year = (0, bid_number_util_1.extractYearFromBidDate)(bid.date);
                bid.bidNumber = await this.generateNextBidNumber(year);
            }
            try {
                return await this.bidRepository.save(bid);
            }
            catch (error) {
                const isUniqueViolation = error?.code === '23505';
                if (!isUniqueViolation || attempt === maxAttempts - 1) {
                    throw error;
                }
                bid.bidNumber = '';
            }
        }
        throw new Error('Failed to assign a unique bid number');
    }
    withNormalizedBidData(bid) {
        bid.data = this.normalizeBidData(bid.data);
        const finalFromSnapshot = Number(bid.data?.snapshot?.totals?.finalTotal);
        if (finalFromSnapshot > 0) {
            bid.totalAmount = finalFromSnapshot;
        }
        return bid;
    }
    async create(createBidDto) {
        const userId = createBidDto.user.id;
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
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
    async findAll() {
        const bids = await this.bidRepository.find({
            relations: ['userEntity'],
            order: { createdAt: 'DESC' },
        });
        return bids.map((bid) => this.withNormalizedBidData(bid));
    }
    async findOne(id) {
        const bid = await this.bidRepository.findOne({
            where: { id },
            relations: ['userEntity'],
        });
        if (!bid) {
            throw new common_1.NotFoundException(`Bid with ID ${id} not found`);
        }
        return this.withNormalizedBidData(bid);
    }
    async findByBidNumber(bidNumber) {
        const bid = await this.bidRepository.findOne({
            where: { bidNumber },
            relations: ['userEntity'],
        });
        if (!bid) {
            throw new common_1.NotFoundException(`Bid with number ${bidNumber} not found`);
        }
        return this.withNormalizedBidData(bid);
    }
    async update(id, updateBidDto) {
        const bid = await this.findOne(id);
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
            }
            else {
                bid.data = this.normalizeBidData(updateBidDto.data);
            }
        }
        else if (updateBidDto.totalAmount !== undefined) {
            bid.totalAmount = updateBidDto.totalAmount;
        }
        if (updateBidDto.user !== undefined) {
            bid.user = updateBidDto.user;
            if (updateBidDto.user.id !== bid.userId) {
                const user = await this.usersService.findById(updateBidDto.user.id);
                if (!user) {
                    throw new common_1.NotFoundException(`User with ID ${updateBidDto.user.id} not found`);
                }
                bid.userEntity = user;
                bid.userId = updateBidDto.user.id;
            }
        }
        const saved = await this.bidRepository.save(bid);
        return this.withNormalizedBidData(saved);
    }
    async cloneWithReprice(id, dto = {}) {
        const sourceBid = await this.findOne(id);
        const userId = sourceBid.user?.id || sourceBid.userId;
        if (!userId) {
            throw new common_1.NotFoundException(`User for source bid ${id} not found`);
        }
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const repriced = await this.recalculateBidPayload(sourceBid.data, dto.configOverrides);
        const useCurrentDate = dto.useCurrentDate ?? true;
        const date = dto.date || (useCurrentDate ? new Date().toISOString().slice(0, 10) : sourceBid.date);
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
    async calculateDraft(dto) {
        const type = String(dto?.type || '').toUpperCase();
        const isBKTP = type.includes('БКТП') || !type;
        if (!isBKTP) {
            return {
                totalAmount: this.normalizeBidData(dto?.data)?.snapshot?.totals?.finalTotal ??
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
    async remove(id) {
        const result = await this.bidRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Bid with ID ${id} not found`);
        }
    }
    async findByUser(userId) {
        return this.bidRepository.find({
            where: { userId },
            relations: ['userEntity'],
            order: { createdAt: 'DESC' },
        });
    }
};
exports.BidsService = BidsService;
exports.BidsService = BidsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bid_entity_1.Bid)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        bid_price_sources_service_1.BidPriceSourcesService,
        bid_reprice_service_1.BidRepriceService])
], BidsService);
//# sourceMappingURL=bids.service.js.map