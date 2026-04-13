import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    getProfile(user: JwtPayload): Promise<import("./entities/user.entity").User | undefined>;
    findOne(id: string): Promise<import("./entities/user.entity").User | undefined>;
    updateProfile(user: JwtPayload, updateDto: UpdateProfileDto): Promise<import("./entities/user.entity").User>;
    update(id: string, updateDto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
    remove(id: string): Promise<void>;
}
