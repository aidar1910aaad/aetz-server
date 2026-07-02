import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { formatAlmatyDateTime } from '../common/utils/format-almaty-datetime';

type LogPayload = {
  entityType: string;
  entityId?: string | number | null;
  action: string;
  fieldChanged?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
  changedBy?: string | null;
};

@Injectable()
export class AuditLogsService {
  private readonly entityTypeLabelsRu: Record<string, string> = {
    material: 'Материал',
    calculation: 'Калькуляция',
    currency_settings: 'Курсы валют',
    auth: 'Авторизация',
  };

  private readonly actionLabelsRu: Record<string, string> = {
    CREATE: 'Создание',
    UPDATE: 'Изменение',
    DELETE: 'Удаление',
    LOGIN: 'Вход',
  };

  private readonly fieldLabelsRu: Record<string, string> = {
    session: 'Сессия',
    entity: 'Сущность',
    name: 'Название',
    unit: 'Ед. изм.',
    currency: 'Валюта',
    priceInCurrency: 'Цена в валюте',
    category: 'Категория',
    usdRate: 'Курс USD',
    eurRate: 'Курс EUR',
    rubRate: 'Курс RUB',
    kztRate: 'Курс KZT',
    cnyRate: 'Курс CNY',
    hourlyWage: 'Часовая ставка',
    vatRate: 'НДС',
    administrativeExpenses: 'Адм. расходы',
    plannedSavings: 'Плановые накопления',
    productionExpenses: 'Производственные расходы',
    defaultCurrency: 'Валюта по умолчанию',
  };

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>
  ) {}

  private toText(value: unknown): string | null {
    if (value === undefined || value === null) return null;
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  async log(payload: LogPayload): Promise<void> {
    const row = new AuditLog();
    row.entityType = payload.entityType;
    row.entityId =
      payload.entityId !== undefined && payload.entityId !== null ? String(payload.entityId) : null;
    row.action = payload.action;
    row.fieldChanged = payload.fieldChanged ?? null;
    row.oldValue = this.toText(payload.oldValue);
    row.newValue = this.toText(payload.newValue);
    row.changedBy = payload.changedBy || 'system';
    await this.auditRepo.save(row);
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    entityType?: string;
    action?: string;
    changedBy?: string;
    materialSearch?: string;
  }): Promise<{
    data: Array<
      AuditLog & {
        entityTypeRu: string;
        actionRu: string;
        fieldChangedRu: string;
        changedAtAlmaty: string;
      }
    >;
    total: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const qb = this.auditRepo.createQueryBuilder('audit').orderBy('audit.changedAt', 'DESC');

    if (query.entityType)
      qb.andWhere('LOWER(audit.entityType) = LOWER(:entityType)', { entityType: query.entityType });
    if (query.action) qb.andWhere('LOWER(audit.action) = LOWER(:action)', { action: query.action });
    if (query.changedBy) {
      const changedByPattern = `%${query.changedBy}%`;
      qb.andWhere(
        `(LOWER(audit.changedBy) LIKE LOWER(:changedBy)
          OR audit.changedBy IN (
            SELECT u.username FROM users u
            WHERE LOWER(u.email) LIKE LOWER(:changedBy)
              OR LOWER(u."firstName") LIKE LOWER(:changedBy)
              OR LOWER(u."lastName") LIKE LOWER(:changedBy)
              OR LOWER(TRIM(CONCAT(COALESCE(u."lastName", ''), ' ', COALESCE(u."firstName", '')))) LIKE LOWER(:changedBy)
          ))`,
        { changedBy: changedByPattern }
      );
    }
    if (query.materialSearch) {
      const materialPattern = `%${query.materialSearch}%`;
      qb.andWhere(
        `(audit.entityType = 'material' AND (
          audit."entityId" IN (
            SELECT CAST(m.id AS varchar) FROM material m
            WHERE LOWER(m.name) LIKE LOWER(:materialSearch)
              OR LOWER(m.code) LIKE LOWER(:materialSearch)
          )
          OR LOWER(audit."oldValue") LIKE LOWER(:materialSearch)
          OR LOWER(audit."newValue") LIKE LOWER(:materialSearch)
        ))`,
        { materialSearch: materialPattern }
      );
    }

    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
    const dataWithLabels = data.map((item) => ({
      ...item,
      entityTypeRu: this.entityTypeLabelsRu[item.entityType] || item.entityType,
      actionRu: this.actionLabelsRu[item.action] || item.action,
      fieldChangedRu: item.fieldChanged
        ? this.fieldLabelsRu[item.fieldChanged] || item.fieldChanged
        : '—',
      changedAtAlmaty: formatAlmatyDateTime(item.changedAt),
    }));
    return { data: dataWithLabels, total };
  }
}
