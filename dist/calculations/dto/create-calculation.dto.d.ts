import { CalculationData, CalculationCategory, CalculationItem, CalculationSettings, CellConfig, CellMaterial } from '../interfaces/calculation-data.interface';
export declare class CreateItemDto implements CalculationItem {
    id: number;
    name: string;
    unit: string;
    price: number;
    quantity: number;
}
export declare class CreateCategoryDto implements CalculationCategory {
    name: string;
    items: CreateItemDto[];
}
export declare class CreateCellMaterialDto implements CellMaterial {
    id: number;
    name: string;
    price: number;
    type: 'switch' | 'rza' | 'counter' | 'sr' | 'tsn' | 'tn' | 'pu' | 'disconnector' | 'busbar' | 'busbridge';
}
export declare class CreateCellConfigDto implements CellConfig {
    type: '0.4kv' | '10kv' | '20kv' | 'rza' | 'pu' | 'disconnector' | 'busbar' | 'busbridge' | 'switch' | 'tn' | 'tsn' | 'input' | 'section_switch' | 'outgoing';
    materials: {
        switch?: CreateCellMaterialDto;
        rza?: CreateCellMaterialDto;
        counter?: CreateCellMaterialDto;
        sr?: CreateCellMaterialDto;
        tsn?: CreateCellMaterialDto;
        tn?: CreateCellMaterialDto;
        tt?: CreateCellMaterialDto[];
        pu?: CreateCellMaterialDto[];
        disconnector?: CreateCellMaterialDto[];
        busbar?: CreateCellMaterialDto[];
        busbridge?: CreateCellMaterialDto[];
    };
}
export declare class CreateCalculationSettingsDto implements CalculationSettings {
    manufacturingHours: number;
    hourlyRate: number;
    overheadPercentage: number;
    adminPercentage: number;
    plannedProfitPercentage: number;
    ndsPercentage: number;
}
export declare class CreateCalculationDataDto implements CalculationData {
    categories: CreateCategoryDto[];
    calculation: CreateCalculationSettingsDto;
    cellConfig: CreateCellConfigDto;
}
export declare class CreateCalculationDto {
    name: string;
    slug: string;
    groupId: number;
    data: CreateCalculationDataDto;
}
