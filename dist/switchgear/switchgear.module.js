"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchgearModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const switchgear_controller_1 = require("./switchgear.controller");
const switchgear_service_1 = require("./switchgear.service");
const switchgear_config_entity_1 = require("./entities/switchgear-config.entity");
let SwitchgearModule = class SwitchgearModule {
};
exports.SwitchgearModule = SwitchgearModule;
exports.SwitchgearModule = SwitchgearModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([switchgear_config_entity_1.SwitchgearConfig])],
        controllers: [switchgear_controller_1.SwitchgearController],
        providers: [switchgear_service_1.SwitchgearService],
        exports: [switchgear_service_1.SwitchgearService],
    })
], SwitchgearModule);
//# sourceMappingURL=switchgear.module.js.map