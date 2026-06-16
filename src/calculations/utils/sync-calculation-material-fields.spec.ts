import {
  patchCalculationDataByMaterialMaps,
  patchCalculationDataBySingleMaterial,
} from './sync-calculation-material-fields';

describe('sync-calculation-material-fields', () => {
  const sampleData = {
    categories: [
      {
        name: 'Категория',
        items: [
          { id: 1, name: 'Старое название', price: 100, unit: 'шт', quantity: 2 },
          { name: 'Ручной материал', price: 50, unit: 'шт', quantity: 1 },
        ],
      },
    ],
    cellConfig: {
      materials: {
        switch: { id: 2, name: 'Выключатель старый', price: 200 },
        rps: [{ id: 3, name: 'РПС старый', price: 300 }],
      },
    },
  };

  it('updates price and name in categories and cellConfig by material id', () => {
    const updated = patchCalculationDataBySingleMaterial(sampleData, 1, {
      price: 150,
      name: 'Новое название',
    });

    expect(updated.categories[0].items[0]).toMatchObject({
      id: 1,
      name: 'Новое название',
      price: 150,
    });
    expect(updated.categories[0].items[1].name).toBe('Ручной материал');
  });

  it('updates materials from maps', () => {
    const updated = patchCalculationDataByMaterialMaps(
      sampleData,
      new Map([
        [2, 250],
        [3, 350],
      ]),
      new Map([
        [2, 'Выключатель новый'],
        [3, 'РПС новый'],
      ])
    );

    expect(updated.cellConfig.materials.switch).toMatchObject({
      id: 2,
      name: 'Выключатель новый',
      price: 250,
    });
    expect(updated.cellConfig.materials.rps[0]).toMatchObject({
      id: 3,
      name: 'РПС новый',
      price: 350,
    });
  });
});
