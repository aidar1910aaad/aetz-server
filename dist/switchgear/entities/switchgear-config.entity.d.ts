export declare class SwitchgearConfig {
    id: number;
    type: string;
    breaker: string;
    amperage: number;
    group: string;
    busbar: string;
    cells: {
        name: string;
        quantity: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
