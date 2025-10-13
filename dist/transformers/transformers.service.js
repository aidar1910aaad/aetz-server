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
exports.TransformersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transformer_entity_1 = require("./entities/transformer.entity");
let TransformersService = class TransformersService {
    constructor(transformerRepository) {
        this.transformerRepository = transformerRepository;
    }
    async create(createTransformerDto) {
        const transformer = this.transformerRepository.create(createTransformerDto);
        return this.transformerRepository.save(transformer);
    }
    async createMany(createTransformersDto) {
        const transformers = createTransformersDto.transformers.map(dto => this.transformerRepository.create(dto));
        return this.transformerRepository.save(transformers);
    }
    async findAll() {
        return this.transformerRepository.find({
            order: {
                model: 'ASC',
            },
        });
    }
    async findOne(id) {
        const transformer = await this.transformerRepository.findOne({ where: { id } });
        if (!transformer) {
            throw new common_1.NotFoundException(`Трансформатор с ID ${id} не найден`);
        }
        return transformer;
    }
    async update(id, updateTransformerDto) {
        const transformer = await this.findOne(id);
        Object.assign(transformer, updateTransformerDto);
        return this.transformerRepository.save(transformer);
    }
    async remove(id) {
        const transformer = await this.findOne(id);
        await this.transformerRepository.remove(transformer);
    }
    async findByVoltage(voltage) {
        return this.transformerRepository.find({
            where: { voltage },
            order: {
                power: 'ASC',
            },
        });
    }
    async findByType(type) {
        return this.transformerRepository.find({
            where: { type },
            order: {
                power: 'ASC',
            },
        });
    }
    async findByManufacturer(manufacturer) {
        return this.transformerRepository.find({
            where: { manufacturer },
            order: {
                model: 'ASC',
            },
        });
    }
};
exports.TransformersService = TransformersService;
exports.TransformersService = TransformersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transformer_entity_1.Transformer)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TransformersService);
//# sourceMappingURL=transformers.service.js.map