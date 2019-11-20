import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class CommentDto {
    @IsOptional()
    @IsNumber()
    id: number;

    @IsNumber()
    eventId: number;

    @IsNumber()
    userId: number;

    @IsString()
    text: string;

    @IsOptional()
    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    createdAt?: string;

    @IsOptional()
    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    updatedAt?: string;
}

export class CommentCreateDto {

    id: number;

    eventId: number;

    userId: number;

    @IsString()
    text: string;
}

export class CommentUpdateDto {

    id: number;

    eventId: number;

    userId: number;

    @IsString()
    text: string;
}