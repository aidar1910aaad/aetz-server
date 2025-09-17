import { User } from '../../users/entities/user.entity';
export declare class Bid {
    id: number;
    bidNumber: string;
    type: string;
    date: string;
    client: string;
    taskNumber: string;
    totalAmount: number;
    data: any;
    user: any;
    userEntity: User;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    generateBidNumber(): void;
}
