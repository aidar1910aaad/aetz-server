export interface CalculationItem {
  id: number;
  name: string;
  unit: string;
  price: number;
  quantity: number;
}

export interface CalculationCategory {
  name: string;
  items: CalculationItem[];
}

export interface CellMaterial {
  id: number;
  name: string;
  price: number;
  type: 'switch' | 'rza' | 'counter' | 'sr' | 'tsn' | 'tn';
}

export interface CellConfig {
  type: '0.4kv' | '10kv' | '20kv' | 'rza';
  materials: {
    switch?: CellMaterial;
    rza?: CellMaterial;
    counter?: CellMaterial;
    sr?: CellMaterial;
    tsn?: CellMaterial;
    tn?: CellMaterial;
  };
}

export interface CalculationSettings {
  manufacturingHours: number;
  hourlyRate: number;
  overheadPercentage: number;
  adminPercentage: number;
  plannedProfitPercentage: number;
  ndsPercentage: number;
}

export interface CalculationData {
  categories: CalculationCategory[];
  calculation: CalculationSettings;
  cellConfig: CellConfig;
} 