import { BidRepriceService } from './bid-reprice.service';
import { Material } from '../../materials/entities/material.entity';

describe('BidRepriceService', () => {
  let service: BidRepriceService;

  beforeEach(() => {
    service = new BidRepriceService();
  });

  it('builds material map and reprices bid data totals', () => {
    const material = {
      id: 10,
      currency: 'USD',
      priceInCurrency: 100,
      price: 100,
    } as Material;

    const maps = service.buildPriceMaps(
      [material],
      { usdRate: 500, eurRate: 550, rubRate: 5, cnyRate: 70, kztRate: 1 },
      {}
    );

    const result = service.repriceBidData(
      {
        config: {
          bmz: {
            settings: {
              areaPriceRanges: [
                {
                  minWallThickness: 80,
                  maxWallThickness: 120,
                  minArea: 0,
                  maxArea: 100,
                  minHeight: 0,
                  maxHeight: 999999,
                  pricePerSquareMeter: 50000,
                },
              ],
              equipment: [],
            },
            buildingType: 'bmz',
            length: 1000,
            width: 1000,
            thickness: 100,
            height: 2700,
            equipmentState: {},
          },
          transformer: {
            price: 1000,
            quantity: 2,
            ustCalculations: [
              {
                name: 'УСТ-0.4кВ',
                data: {
                  categories: [{ items: [{ id: 10, price: 1, quantity: 1 }] }],
                  calculation: {
                    manufacturingHours: 0,
                    hourlyRate: 0,
                    overheadPercentage: 0,
                    adminPercentage: 0,
                    plannedProfitPercentage: 0,
                    ndsPercentage: 0,
                  },
                },
              },
            ],
            busbarUstData: { mainUstWeight: 1, zeroUstWeight: 0, material: 'Алюминий' },
          },
          works: { selected: {}, worksList: [] },
          additionalEquipment: { selected: {}, equipmentList: [] },
          rusn: {},
          runn: {},
        },
      },
      maps
    );

    expect(maps.materialsMap.get(10)).toBe(50000);
    expect(
      result.data.config.transformer.ustCalculations[0].data.categories[0].items[0].price
    ).toBe(50000);
    expect(result.data.snapshot.totals.bmzTotal).toBe(50000);
    expect(result.data.snapshot.totals.transformerTotal).toBe(107600);
    expect(result.totalAmount).toBe(157600);
    expect(result.data.snapshot.totals.grandTotal).toBe(157600);
  });

  it('refreshes transformer price and ust calculation from catalog', () => {
    const material = {
      id: 10,
      currency: 'USD',
      priceInCurrency: 100,
      price: 100,
    } as Material;

    const maps = service.buildPriceMaps(
      [material],
      { usdRate: 500, eurRate: 550, rubRate: 5, cnyRate: 70, kztRate: 1 },
      {},
      null,
      [
        {
          id: 1,
          model: 'ТСЛ-1000',
          voltage: '10',
          type: 'ТСЛ',
          power: 1000,
          manufacturer: 'Test',
          price: 9000,
        },
      ],
      [
        {
          id: 5,
          name: 'УСТ-0.4кВ',
          slug: 'ust-04',
          data: {
            categories: [{ items: [{ id: 10, price: 999, quantity: 1 }] }],
            calculation: {
              manufacturingHours: 0,
              hourlyRate: 0,
              overheadPercentage: 0,
              adminPercentage: 0,
              plannedProfitPercentage: 0,
              ndsPercentage: 0,
            },
          },
        },
      ]
    );

    const result = service.repriceBidData(
      {
        config: {
          transformer: {
            id: 1,
            price: 1000,
            quantity: 2,
            ustCalculations: [
              {
                id: 5,
                name: 'УСТ-0.4кВ',
                data: {
                  categories: [{ items: [{ id: 10, price: 1, quantity: 1 }] }],
                  calculation: {
                    manufacturingHours: 0,
                    hourlyRate: 0,
                    overheadPercentage: 0,
                    adminPercentage: 0,
                    plannedProfitPercentage: 0,
                    ndsPercentage: 0,
                  },
                },
              },
            ],
            busbarUstData: { mainUstWeight: 1, zeroUstWeight: 0, material: 'Алюминий' },
          },
          works: { selected: {}, worksList: [] },
          additionalEquipment: { selected: {}, equipmentList: [] },
          rusn: {},
          runn: {},
        },
      },
      maps
    );

    expect(result.data.config.transformer.price).toBe(9000);
    expect(result.data.config.transformer.model).toBe('ТСЛ-1000');
    expect(
      result.data.config.transformer.ustCalculations[0].data.categories[0].items[0].price
    ).toBe(50000);
    expect(result.data.snapshot.totals.transformerTotal).toBe(123600);
  });

  it('refreshes transformer when stored as { selected, total }', () => {
    const material = {
      id: 10,
      currency: 'KZT',
      priceInCurrency: 50000,
      price: 50000,
    } as Material;

    const maps = service.buildPriceMaps(
      [material],
      { usdRate: 500, eurRate: 550, rubRate: 5, cnyRate: 70, kztRate: 1 },
      {},
      null,
      [
        {
          id: 1,
          model: 'ТМГ-2000',
          voltage: '10',
          type: 'ТМГ',
          power: 2000,
          manufacturer: 'Test',
          price: 8500000,
        },
      ],
      []
    );

    const result = service.repriceBidData(
      {
        transformer: {
          selected: {
            id: 1,
            model: 'ТМГ-2000',
            price: 7596750,
            quantity: 2,
            ustCalculations: [],
          },
          total: 15193500,
        },
        config: {
          transformer: {
            selected: {
              id: 1,
              model: 'ТМГ-2000',
              price: 7596750,
              quantity: 2,
              ustCalculations: [],
            },
            total: 15193500,
          },
        },
      },
      maps
    );

    expect(result.data.transformer.selected.price).toBe(8500000);
    expect(result.data.config.transformer.selected.price).toBe(8500000);
    expect(result.data.snapshot.totals.transformerTotal).toBe(17000000);
  });

  it('recalculates table markup totals from preserved percents', () => {
    const maps = service.buildPriceMaps(
      [],
      { usdRate: 500, eurRate: 550, rubRate: 5, cnyRate: 70, kztRate: 1 },
      {},
      null,
      [
        {
          id: 1,
          model: 'ТМГ-2000',
          voltage: '10',
          type: 'ТМГ',
          power: 2000,
          manufacturer: 'Test',
          price: 10000000,
        },
      ],
      []
    );

    const result = service.repriceBidData(
      {
        tableMarkupPercents: {
          transformer: 30,
        },
        tableMarkupTotals: {
          transformer: 21747753,
        },
        snapshot: {
          totals: {
            transformerTotal: 16729041,
          },
        },
        config: {
          transformer: {
            selected: {
              id: 1,
              model: 'ТМГ-2000',
              price: 7596750,
              quantity: 2,
              ustCalculations: [],
            },
          },
          works: { selected: {}, worksList: [] },
          additionalEquipment: { selected: {}, equipmentList: [] },
          rusn: {},
          runn: {},
        },
      },
      maps
    );

    const newBase = result.data.snapshot.totals.transformerTotal;
    expect(result.data.tableMarkupPercents.transformer).toBe(30);
    expect(result.data.tableMarkupTotals.transformer).toBe(Math.round(newBase * 1.3));
    expect(newBase).toBe(20000000);
  });

  it('uses busbar material prices from materials map for UST-0.4kV', () => {
    const aluminum = {
      id: 3489,
      currency: 'KZT',
      priceInCurrency: 3500,
      price: 3500,
    } as Material;
    const copper = {
      id: 3490,
      currency: 'KZT',
      priceInCurrency: 6000,
      price: 6000,
    } as Material;

    const maps = service.buildPriceMaps(
      [aluminum, copper],
      { usdRate: 500, eurRate: 550, rubRate: 5, cnyRate: 70, kztRate: 1 },
      {},
      null,
      [],
      []
    );

    const result = service.repriceBidData(
      {
        config: {
          transformer: {
            selected: {
              id: 0,
              price: 0,
              quantity: 1,
              busbarUstData: { mainUstWeight: 10, zeroUstWeight: 5, material: 'Алюминий' },
              ustCalculations: [
                {
                  name: 'УСТ-0.4кВ',
                  data: {
                    categories: [{ items: [{ price: 100000, quantity: 1 }] }],
                    calculation: {
                      manufacturingHours: 0,
                      hourlyRate: 0,
                      overheadPercentage: 0,
                      adminPercentage: 0,
                      plannedProfitPercentage: 0,
                      ndsPercentage: 0,
                    },
                  },
                },
              ],
            },
          },
          works: { selected: {}, worksList: [] },
          additionalEquipment: { selected: {}, equipmentList: [] },
          rusn: {},
          runn: {},
        },
      },
      maps
    );

    const ustRow = result.data.snapshot.transformer.rows.find((r: { name: string }) =>
      r.name.includes('0.4')
    );
    expect(ustRow.price).toBe(152500);
  });

  it('overrides calculation rates from API currency settings when present', () => {
    const maps = service.buildPriceMaps(
      [],
      {
        usdRate: 500,
        eurRate: 550,
        rubRate: 5,
        cnyRate: 70,
        kztRate: 1,
        hourlyWage: 2000,
        productionExpenses: 10,
        administrativeExpenses: 15,
        plannedSavings: 10,
        vatRate: 12,
      },
      {}
    );

    const result = service.repriceBidData(
      {
        config: {
          transformer: {
            price: 0,
            quantity: 1,
            ustCalculation: {
              name: 'УСТ API settings',
              data: {
                categories: [{ items: [{ price: 100000, quantity: 1 }] }],
                calculation: {
                  manufacturingHours: 1,
                  hourlyRate: 0,
                  overheadPercentage: 0,
                  adminPercentage: 0,
                  plannedProfitPercentage: 0,
                  ndsPercentage: 0,
                },
              },
            },
          },
          works: { selected: {}, worksList: [] },
          additionalEquipment: { selected: {}, equipmentList: [] },
          rusn: {},
          runn: {},
        },
      },
      maps
    );

    expect(result.data.config.transformer.ustCalculation.data.calculation).toMatchObject({
      manufacturingHours: 1,
      hourlyRate: 2000,
      overheadPercentage: 10,
      adminPercentage: 15,
      plannedProfitPercentage: 10,
      ndsPercentage: 12,
    });
    expect(result.data.snapshot.totals.transformerTotal).toBe(156464);
  });

  it('rebuilds aggregate installation work from current work prices', () => {
    const workPrices = {
      bmzPriceUpTo6Blocks: 10,
      bmzPriceOver6Blocks: 20,
      bmzExternalGroundingPerMeter: 5,
      bmzInternalGroundingPerKit: 1000,
      bmzCableRacks: 2000,
      rusnPriceUpTo6Cells: 30,
      rusnPrice6To8Cells: 40,
      rusnPriceOver8Cells: 50,
      rusnBusBridgePrice: 60,
      rusnBusBridgeInstallationPrice: 70,
      rusnTransformerUnitPrice: 80,
      runnMountRu04UpTo7PerPanel: 90,
      runnMountRu048To9PerPanel: 100,
      runnMountRu04Over9PerPanel: 110,
      runnShmInstallation: 120,
      runnUnitMt10x100Double: 130,
      transformerPrice630: 0,
      transformerPrice1000: 140,
      transformerPrice2500: 0,
    };
    const maps = service.buildPriceMaps(
      [],
      { usdRate: 500, eurRate: 550, rubRate: 5, cnyRate: 70, kztRate: 1 },
      workPrices
    );

    const result = service.repriceBidData(
      {
        config: {
          bmz: {
            buildingType: 'bmz',
            blockCount: 8,
            length: 10000,
            width: 5000,
            settings: {},
          },
          transformer: {
            power: 1000,
            quantity: 2,
            price: 0,
          },
          rusn: {
            cellConfigs: [{ count: 4 }, { count: 5 }],
            busBridges: [{ quantity: 2 }],
          },
          runn: {
            cellConfigs: [{ quantity: 5 }, { quantity: 3 }, { quantity: 2 }],
            busBridges: [{ quantity: 1 }],
            busbarSummary: {
              name: 'Сборные шины ЩО 70 (шина МТ2 (10x100мм) 2000A)',
            },
          },
          works: {
            selected: { 'Монтаж оборудования': { checked: true, count: 1 } },
            worksList: [{ name: 'Монтаж оборудования', price: 1, unit: 'раб' }],
          },
          additionalEquipment: { selected: {}, equipmentList: [] },
        },
      },
      maps
    );

    const worksList = result.data.config.works.worksList;
    const aggregate = worksList.find(
      (work: { name: string }) => work.name === 'Монтаж оборудования'
    );

    expect(worksList).toHaveLength(1);
    expect(aggregate.price).toBe(5520);
    expect(aggregate.total).toBe(5520);
    expect(aggregate.calculationDetails.length).toBeGreaterThan(1);
    expect(result.data.snapshot.totals.worksTotal).toBe(5520);
    expect(result.totalAmount).toBe(5520);
  });

  it('changes aggregate installation total when database work prices change', () => {
    const payload = {
      config: {
        bmz: {
          buildingType: 'bmz',
          blockCount: 1,
          length: 1000,
          width: 1000,
          settings: {},
        },
        transformer: {
          power: 630,
          quantity: 1,
          price: 0,
        },
        rusn: {},
        runn: {},
        works: {
          selected: { 'Монтаж оборудования': { checked: true, count: 1 } },
          worksList: [{ name: 'Монтаж оборудования', price: 999999, unit: 'раб' }],
        },
        additionalEquipment: { selected: {}, equipmentList: [] },
      },
    };
    const rates = { usdRate: 500, eurRate: 550, rubRate: 5, cnyRate: 70, kztRate: 1 };

    const first = service.repriceBidData(
      payload,
      service.buildPriceMaps([], rates, {
        bmzPriceUpTo6Blocks: 100,
        transformerPrice630: 200,
      })
    );
    const second = service.repriceBidData(
      payload,
      service.buildPriceMaps([], rates, {
        bmzPriceUpTo6Blocks: 300,
        transformerPrice630: 400,
      })
    );

    expect(first.data.snapshot.totals.worksTotal).toBe(300);
    expect(second.data.snapshot.totals.worksTotal).toBe(700);
  });
});
