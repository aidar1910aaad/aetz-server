"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const transformers_service_1 = require("./transformers.service");
const transformers_controller_1 = require("./transformers.controller");
const transformer_entity_1 = require("./entities/transformer.entity");
let TransformersModule = class TransformersModule {
};
exports.TransformersModule = TransformersModule;
exports.TransformersModule = TransformersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([transformer_entity_1.Transformer])],
        controllers: [transformers_controller_1.TransformersController],
        providers: [transformers_service_1.TransformersService],
        exports: [transformers_service_1.TransformersService],
    })
], TransformersModule);
//# sourceMappingURL=transformers.module.js.map