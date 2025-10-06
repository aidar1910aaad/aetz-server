declare class UserDto {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
}
export declare class CreateBidDto {
    type: string;
    date: string;
    client: string;
    taskNumber: string;
    totalAmount?: number;
    user: UserDto;
    data: any;
}
export {};
