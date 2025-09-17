import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
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
    role?: UserRole;
}
