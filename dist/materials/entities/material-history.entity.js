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
exports.MaterialHistory = void 0;
const typeorm_1 = require("typeorm");
const material_entity_1 = require("./material.entity");
let MaterialHistory = class MaterialHistory {
};
exports.MaterialHistory = MaterialHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MaterialHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => material_entity_1.Material, { onDelete: 'CASCADE' }),
    __metadata("design:type", material_entity_1.Material)
], MaterialHistory.prototype, "material", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MaterialHistory.prototype, "fieldChanged", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MaterialHistory.prototype, "oldValue", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MaterialHistory.prototype, "newValue", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MaterialHistory.prototype, "changedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MaterialHistory.prototype, "changedAt", void 0);
exports.MaterialHistory = MaterialHistory = __decorate([
    (0, typeorm_1.Entity)()
], MaterialHistory);
//# sourceMappingURL=material-history.entity.js.map