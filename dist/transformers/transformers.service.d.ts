import { Repository } from 'typeorm';
import { Transformer } from './entities/transformer.entity';
import { CreateTransformerDto } from './dto/create-transformer.dto';
import { UpdateTransformerDto } from './dto/update-transformer.dto';
import { CreateTransformersDto } from './dto/create-transformers.dto';
export declare class TransformersService {
    private readonly transformerRepository;
    constructor(transformerRepository: Repository<Transformer>);
    create(createTransformerDto: CreateTransformerDto): Promise<Transformer>;
    createMany(createTransformersDto: CreateTransformersDto): Promise<Transformer[]>;
    findAll(): Promise<Transformer[]>;
    findOne(id: number): Promise<Transformer>;
    update(id: number, updateTransformerDto: UpdateTransformerDto): Promise<Transformer>;
    remove(id: number): Promise<void>;
    findByVoltage(voltage: string): Promise<Transformer[]>;
    findByType(type: string): Promise<Transformer[]>;
    findByManufacturer(manufacturer: string): Promise<Transformer[]>;
}
