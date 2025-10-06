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
exports.SwitchgearService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const switchgear_config_entity_1 = require("./entities/switchgear-config.entity");
let SwitchgearService = class SwitchgearService {
    constructor(switchgearRepository) {
        this.switchgearRepository = switchgearRepository;
    }
    async create(createSwitchgearConfigDto) {
        const config = this.switchgearRepository.create(createSwitchgearConfigDto);
        return this.switchgearRepository.save(config);
    }
    async findAll(query) {
        const qb = this.switchgearRepository.createQueryBuilder('config');
        if (query.type) {
            qb.andWhere('config.type = :type', { type: query.type });
        }
        if (query.amperage) {
            qb.andWhere('config.amperage = :amperage', { amperage: query.amperage });
        }
        if (query.group) {
            qb.andWhere('config.group = :group', { group: query.group });
        }
        return qb.getMany();
    }
    async findOne(id) {
        const config = await this.switchgearRepository.findOne({ where: { id } });
        if (!config) {
            throw new common_1.NotFoundException(`Конфигурация с ID ${id} не найдена`);
        }
        return config;
    }
    async update(id, updateSwitchgearConfigDto) {
        const config = await this.findOne(id);
        Object.assign(config, updateSwitchgearConfigDto);
        return this.switchgearRepository.save(config);
    }
    async remove(id) {
        const result = await this.switchgearRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Конфигурация с ID ${id} не найдена`);
        }
    }
};
exports.SwitchgearService = SwitchgearService;
exports.SwitchgearService = SwitchgearService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(switchgear_config_entity_1.SwitchgearConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SwitchgearService);
//# sourceMappingURL=switchgear.service.js.map