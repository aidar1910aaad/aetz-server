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
exports.Setting = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Setting = class Setting {
    constructor() {
        this.id = 'settings';
    }
};
exports.Setting = Setting;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Setting.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-03-20T10:00:00Z', description: 'Дата создания' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Setting.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-03-20T10:00:00Z', description: 'Дата последнего обновления' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Setting.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Настройки оборудования',
        example: {
            rusn: [],
            bmz: [],
            runn: [],
            work: [],
            transformer: [],
            additionalEquipment: [],
            sr: [],
            tsn: [],
            tn: []
        }
    }),
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], Setting.prototype, "settings", void 0);
exports.Setting = Setting = __decorate([
    (0, typeorm_1.Entity)()
], Setting);
//# sourceMappingURL=setting.entity.js.map