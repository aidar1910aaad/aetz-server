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
let BidsService = class BidsService {
    constructor(bidRepository, usersService) {
        this.bidRepository = bidRepository;
        this.usersService = usersService;
    }
    async create(createBidDto) {
        const userId = createBidDto.user.id;
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
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
    async findAll() {
        return this.bidRepository.find({
            relations: ['userEntity'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const bid = await this.bidRepository.findOne({
            where: { id },
            relations: ['userEntity'],
        });
        if (!bid) {
            throw new common_1.NotFoundException(`Bid with ID ${id} not found`);
        }
        return bid;
    }
    async findByBidNumber(bidNumber) {
        const bid = await this.bidRepository.findOne({
            where: { bidNumber },
            relations: ['userEntity'],
        });
        if (!bid) {
            throw new common_1.NotFoundException(`Bid with number ${bidNumber} not found`);
        }
        return bid;
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
        if (updateBidDto.totalAmount !== undefined) {
            bid.totalAmount = updateBidDto.totalAmount;
        }
        if (updateBidDto.data !== undefined) {
            bid.data = updateBidDto.data;
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
        return this.bidRepository.save(bid);
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
            order: { createdAt: 'DESC' }
        });
    }
};
exports.BidsService = BidsService;
exports.BidsService = BidsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bid_entity_1.Bid)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], BidsService);
//# sourceMappingURL=bids.service.js.map