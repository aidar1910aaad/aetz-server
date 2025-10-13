import { Bid } from '../../bids/entities/bid.entity';
export declare enum UserRole {
    ADMIN = "admin",
    PTO = "pto",
    MANAGER = "manager"
}
export declare class User {
    id: number;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    position?: string;
    country?: string;
    city?: string;
    postalCode?: string;
    role: UserRole;
    bids: Bid[];
    createdAt: Date;
}
