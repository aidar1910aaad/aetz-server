import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

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
  // Для текущей схемы с TIMESTAMP без timezone в БД добавляем поправку +5 часов,
  // чтобы вывести фактическое локальное время Алматы в журнале.
  private static readonly ALMATY_LEGACY_OFFSET_MS = 5 * 60 * 60 * 1000;
  private readonly entityTypeLabelsRu: Record<string, string> = {
    material: 'Материал',
    calculation: 'Калькуляция',
    currency_settings: 'Курсы валют',
  };

  private readonly actionLabelsRu: Record<string, string> = {
    CREATE: 'Создание',
    UPDATE: 'Изменение',
    DELETE: 'Удаление',
  };

  private readonly fieldLabelsRu: Record<string, string> = {
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
    private readonly auditRepo: Repository<AuditLog>,
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
    row.entityId = payload.entityId !== undefined && payload.entityId !== null ? String(payload.entityId) : null;
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
  }): Promise<{ data: Array<AuditLog & { entityTypeRu: string; actionRu: string; fieldChangedRu: string; changedAtAlmaty: string }>; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const qb = this.auditRepo.createQueryBuilder('audit').orderBy('audit.changedAt', 'DESC');

    if (query.entityType) qb.andWhere('LOWER(audit.entityType) = LOWER(:entityType)', { entityType: query.entityType });
    if (query.action) qb.andWhere('LOWER(audit.action) = LOWER(:action)', { action: query.action });
    if (query.changedBy) qb.andWhere('LOWER(audit.changedBy) LIKE LOWER(:changedBy)', { changedBy: `%${query.changedBy}%` });

    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
    const dataWithLabels = data.map((item) => {
      // Поправка для корректного отображения времени в Алматы.
      // Иначе фронт получает время с отставанием.
      const correctedDate = new Date(item.changedAt.getTime() + AuditLogsService.ALMATY_LEGACY_OFFSET_MS);
      return {
        ...item,
        entityTypeRu: this.entityTypeLabelsRu[item.entityType] || item.entityType,
        actionRu: this.actionLabelsRu[item.action] || item.action,
        fieldChangedRu: item.fieldChanged ? (this.fieldLabelsRu[item.fieldChanged] || item.fieldChanged) : '—',
        changedAtAlmaty: new Intl.DateTimeFormat('ru-RU', {
          timeZone: 'Asia/Almaty',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(correctedDate),
      };
    });
    return { data: dataWithLabels, total };
  }
}
