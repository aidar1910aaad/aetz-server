import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
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
