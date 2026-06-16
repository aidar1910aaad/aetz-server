export interface MaterialFieldUpdates {
  price?: number;
  name?: string;
}

function applyUpdatesToItem(item: any, updates: MaterialFieldUpdates): any {
  return {
    ...item,
    ...(updates.price !== undefined ? { price: updates.price } : {}),
    ...(updates.name !== undefined ? { name: updates.name } : {}),
  };
}

export function patchCalculationDataMaterialFields(
  data: any,
  getUpdates: (materialId: number) => MaterialFieldUpdates | undefined
): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const nextData = { ...data };

  if (Array.isArray(nextData.categories)) {
    nextData.categories = nextData.categories.map((category) => {
      if (!Array.isArray(category?.items)) {
        return category;
      }

      return {
        ...category,
        items: category.items.map((item) => {
          if (!item?.id) {
            return item;
          }

          const updates = getUpdates(item.id);
          return updates ? applyUpdatesToItem(item, updates) : item;
        }),
      };
    });
  }

  if (nextData.cellConfig?.materials && typeof nextData.cellConfig.materials === 'object') {
    const materials = { ...nextData.cellConfig.materials };

    Object.keys(materials).forEach((key) => {
      const value = materials[key];

      if (Array.isArray(value)) {
        materials[key] = value.map((item) => {
          if (!item?.id) {
            return item;
          }

          const updates = getUpdates(item.id);
          return updates ? applyUpdatesToItem(item, updates) : item;
        });
        return;
      }

      if (value?.id) {
        const updates = getUpdates(value.id);
        if (updates) {
          materials[key] = applyUpdatesToItem(value, updates);
        }
      }
    });

    nextData.cellConfig = {
      ...nextData.cellConfig,
      materials,
    };
  }

  return nextData;
}

export function patchCalculationDataByMaterialMaps(
  data: any,
  pricesByMaterialId: Map<number, number>,
  namesByMaterialId: Map<number, string>
): any {
  return patchCalculationDataMaterialFields(data, (materialId) => {
    const price = pricesByMaterialId.get(materialId);
    const name = namesByMaterialId.get(materialId);

    if (price === undefined && name === undefined) {
      return undefined;
    }

    return {
      ...(price !== undefined ? { price } : {}),
      ...(name !== undefined ? { name } : {}),
    };
  });
}

export function patchCalculationDataBySingleMaterial(
  data: any,
  materialId: number,
  updates: MaterialFieldUpdates
): any {
  return patchCalculationDataMaterialFields(data, (id) =>
    id === materialId ? updates : undefined
  );
}
