declare class CellDto {
    name: string;
    quantity: number;
}
export declare class CreateSwitchgearConfigDto {
    type: string;
    breaker: string;
    amperage: number;
    group: string;
    busbar: string;
    cells: CellDto[];
}
export {};
