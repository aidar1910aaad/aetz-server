import { TransformersService } from './transformers.service';
import { CreateTransformerDto } from './dto/create-transformer.dto';
import { UpdateTransformerDto } from './dto/update-transformer.dto';
import { CreateTransformersDto } from './dto/create-transformers.dto';
import { Transformer } from './entities/transformer.entity';
export declare class TransformersController {
    private readonly transformersService;
    constructor(transformersService: TransformersService);
    create(createTransformerDto: CreateTransformerDto): Promise<Transformer>;
    createMany(createTransformersDto: CreateTransformersDto): Promise<Transformer[]>;
    findAll(): Promise<Transformer[]>;
    findByVoltage(voltage: string): Promise<Transformer[]>;
    findByType(type: string): Promise<Transformer[]>;
    findByManufacturer(manufacturer: string): Promise<Transformer[]>;
    findOne(id: number): Promise<Transformer>;
    update(id: number, updateTransformerDto: UpdateTransformerDto): Promise<Transformer>;
    remove(id: number): Promise<void>;
}
