import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(username: string, pass: string): Promise<{
        id: number;
        username: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        position?: string;
        country?: string;
        city?: string;
        postalCode?: string;
        role: import("../users/entities/user.entity").UserRole;
        bids: import("../bids/entities/bid.entity").Bid[];
        createdAt: Date;
    } | null>;
    login({ username, password }: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            phone?: string;
            position?: string;
            country?: string;
            city?: string;
            postalCode?: string;
            role: import("../users/entities/user.entity").UserRole;
            bids: import("../bids/entities/bid.entity").Bid[];
            createdAt: Date;
        };
    }>;
}
