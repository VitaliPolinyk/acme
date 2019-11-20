import { IsString, IsOptional, IsDateString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { CommentDto } from '../comment/CommentDto';
import { Type } from 'class-transformer';

export class EventDto {

    @IsOptional()
    @IsNumber()
    id: number;

    @IsOptional()
    @IsNumber()
    userId: number;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    datetime?: string;

    @IsOptional()
    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    createdAt?: string;

    @IsOptional()
    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    updatedAt?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CommentDto)
    comments?: CommentDto[];
}

export class EventCreateDto extends EventDto {
    id: number;

    @IsNumber()
    userId: number;

    @IsString()
    title: string;

    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    datetime: string;
    
}

export class EventUpdateDto extends EventDto {
    @IsNumber()
    id: number;

    @IsNumber()
    userId: number;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    datetime?: string;

}