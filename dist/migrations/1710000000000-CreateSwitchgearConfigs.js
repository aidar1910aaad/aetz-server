"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSwitchgearConfigs1710000000000 = void 0;
class CreateSwitchgearConfigs1710000000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE switchgear_configs (
        id SERIAL PRIMARY KEY,
        type VARCHAR NOT NULL,
        breaker VARCHAR NOT NULL,
        amperage INTEGER NOT NULL,
        "group" VARCHAR NOT NULL,
        busbar VARCHAR NOT NULL,
        cells JSONB NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE switchgear_configs;`);
    }
}
exports.CreateSwitchgearConfigs1710000000000 = CreateSwitchgearConfigs1710000000000;
//# sourceMappingURL=1710000000000-CreateSwitchgearConfigs.js.map