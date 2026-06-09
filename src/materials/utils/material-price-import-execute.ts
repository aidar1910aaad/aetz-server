import { QueryRunner } from 'typeorm';
import { CHANGED_BY, PlannedAction, PlannedUpdate } from './material-price-import-plan';

type MaterialSnapshot = {
  priceInCurrency: number;
};

async function insertHistory(
  queryRunner: QueryRunner,
  materialId: number,
  fieldChanged: string,
  oldValue: string,
  newValue: string
): Promise<void> {
  await queryRunner.query(
    `INSERT INTO material_history ("materialId", "fieldChanged", "oldValue", "newValue", "changedBy")
     VALUES ($1, $2, $3, $4, $5)`,
    [materialId, fieldChanged, oldValue, newValue, CHANGED_BY]
  );
}

async function insertAudit(
  queryRunner: QueryRunner,
  entityId: number,
  action: string,
  fieldChanged: string | null,
  oldValue: string | null,
  newValue: string | null
): Promise<void> {
  await queryRunner.query(
    `INSERT INTO audit_logs ("entityType", "entityId", action, "fieldChanged", "oldValue", "newValue", "changedBy")
     VALUES ('material', $1, $2, $3, $4, $5, $6)`,
    [String(entityId), action, fieldChanged, oldValue, newValue, CHANGED_BY]
  );
}

export async function executeImportActions(
  queryRunner: QueryRunner,
  actions: PlannedAction[],
  materialsByCode: Map<string, MaterialSnapshot>
): Promise<{ createdIds: number[]; updatedIds: number[] }> {
  const createdIds: number[] = [];
  const updatedIds: number[] = [];

  for (const action of actions) {
    if (action.kind === 'update') {
      const material = materialsByCode.get(action.code);
      if (!material) continue;

      await applyUpdate(queryRunner, action, material.priceInCurrency);
      updatedIds.push(action.materialId);
      continue;
    }

    const result = (await queryRunner.query(
      `INSERT INTO material (name, code, unit, price, currency, "priceInCurrency", "rateAtCreation", "priceKztAtCreation")
       VALUES ($1, $2, $3, $4, 'KZT', $4, 1, $4)
       RETURNING id`,
      [action.name, action.code, action.unit, action.price]
    )) as Array<{ id: number }>;

    const newId = Number(result[0]?.id);
    createdIds.push(newId);

    await insertAudit(
      queryRunner,
      newId,
      'CREATE',
      'entity',
      null,
      `Создан материал "${action.name}" (${action.code})`
    );
  }

  return { createdIds, updatedIds };
}

async function applyUpdate(
  queryRunner: QueryRunner,
  action: PlannedUpdate,
  priceInCurrency: number
): Promise<void> {
  if (action.updateName) {
    await insertHistory(queryRunner, action.materialId, 'name', action.oldName, action.nextName);
    await insertAudit(
      queryRunner,
      action.materialId,
      'UPDATE',
      'name',
      action.oldName,
      action.nextName
    );
  }

  if (action.updatePrice) {
    const currencyChanged = action.oldCurrency.toUpperCase() !== 'KZT';

    await insertHistory(
      queryRunner,
      action.materialId,
      'priceInCurrency',
      String(priceInCurrency),
      String(action.nextPrice)
    );
    await insertAudit(
      queryRunner,
      action.materialId,
      'UPDATE',
      'priceInCurrency',
      String(priceInCurrency),
      String(action.nextPrice)
    );

    if (currencyChanged) {
      await insertHistory(queryRunner, action.materialId, 'currency', action.oldCurrency, 'KZT');
      await insertAudit(
        queryRunner,
        action.materialId,
        'UPDATE',
        'currency',
        action.oldCurrency,
        'KZT'
      );
    }
  }

  if (action.updateName && action.updatePrice) {
    await queryRunner.query(
      `UPDATE material
       SET name = $2, currency = 'KZT', "priceInCurrency" = $3, price = $3, "updatedAt" = NOW()
       WHERE id = $1`,
      [action.materialId, action.nextName, action.nextPrice]
    );
    return;
  }

  if (action.updateName) {
    await queryRunner.query(`UPDATE material SET name = $2, "updatedAt" = NOW() WHERE id = $1`, [
      action.materialId,
      action.nextName,
    ]);
    return;
  }

  if (action.updatePrice) {
    await queryRunner.query(
      `UPDATE material
       SET currency = 'KZT', "priceInCurrency" = $2, price = $2, "updatedAt" = NOW()
       WHERE id = $1`,
      [action.materialId, action.nextPrice]
    );
  }
}
