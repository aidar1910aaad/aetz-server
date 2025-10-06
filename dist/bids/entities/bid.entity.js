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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bid = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Bid = class Bid {
    generateBidNumber() {
        if (!this.bidNumber) {
            const year = new Date().getFullYear();
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            this.bidNumber = `BID-${year}-${random}`;
        }
    }
};
exports.Bid = Bid;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Уникальный ID заявки' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Bid.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'BID-2024-001',
        description: 'Уникальный номер заявки'
    }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Bid.prototype, "bidNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'БКТП',
        description: 'Тип заявки'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bid.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-09-17',
        description: 'Дата заявки'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bid.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'ООО Ромашка',
        description: 'Название клиента'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bid.prototype, "client", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '12345',
        description: 'Номер задачи'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bid.prototype, "taskNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 52899246.59,
        description: 'Общая сумма заявки'
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Bid.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Все данные заявки (гибкая структура)',
        example: {
            bmz: {
                buildingType: 'bmz',
                length: 5000,
                width: 6000,
                height: 3000,
                thickness: 100,
                total: 1500000
            },
            transformer: {
                selected: { id: 1, model: 'ТСЛ-1250/20', price: 19026000 },
                total: 19026000
            },
            rusn: {
                cellConfigs: [
                    { type: '0.4kv', materials: { switch: { id: 1, name: 'Выключатель', price: 50000 } } }
                ],
                busbarSummary: { total: 100000 },
                total: 150000
            },
            runn: {
                cellSummaries: [
                    { type: '10kv', quantity: 2, total: 500000 }
                ],
                total: 9088368.92
            },
            additionalEquipment: {
                selected: { id: 1, name: 'Вентиляция' },
                equipmentList: [
                    { id: 1, name: 'Вентиляция', price: 50000 },
                    { id: 2, name: 'Утепление', price: 30000 }
                ],
                total: 80000
            },
            works: {
                selected: { id: 1, name: 'Монтаж' },
                worksList: [
                    { id: 1, name: 'Монтаж БМЗ', price: 500000 },
                    { id: 2, name: 'Монтаж трансформатора', price: 300000 }
                ],
                total: 1865410
            }
        },
        type: 'object',
        additionalProperties: true
    }),
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], Bid.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Информация о пользователе',
        example: { id: 4, username: 'aidarr', firstName: 'Айдар', lastName: 'Айдарович' }
    }),
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], Bid.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.bids, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Bid.prototype, "userEntity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Bid.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-09-17T10:00:00Z',
        description: 'Дата создания заявки'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Bid.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-09-17T10:00:00Z',
        description: 'Дата последнего обновления заявки'
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Bid.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Bid.prototype, "generateBidNumber", null);
exports.Bid = Bid = __decorate([
    (0, typeorm_1.Entity)('bids')
], Bid);
//# sourceMappingURL=bid.entity.js.map