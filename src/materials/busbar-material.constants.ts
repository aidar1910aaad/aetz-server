/** Материалы для расчёта доплаты шин в УСТ-0.4кВ (как на клиенте). */
export const BUSBAR_UST_MATERIAL_IDS = {
  aluminum: 3489,
  copper: 3490,
} as const;

export const BUSBAR_UST_FALLBACK_PRICE_PER_KG = {
  aluminum: 2800,
  copper: 5600,
} as const;

export function getBusbarPricePerKgFromMap(
  material: string,
  materialsMap: Map<number, number>
): number {
  const isAluminum =
    material === 'Алюминий' || material?.includes('АД') || material === 'АД' || material === 'АД2';
  const materialId = isAluminum
    ? BUSBAR_UST_MATERIAL_IDS.aluminum
    : BUSBAR_UST_MATERIAL_IDS.copper;
  const fromMap = materialsMap.get(materialId);
  if (fromMap !== undefined && fromMap > 0) {
    return fromMap;
  }
  return isAluminum
    ? BUSBAR_UST_FALLBACK_PRICE_PER_KG.aluminum
    : BUSBAR_UST_FALLBACK_PRICE_PER_KG.copper;
}
