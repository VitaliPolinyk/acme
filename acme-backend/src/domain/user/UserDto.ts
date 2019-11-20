import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class UserDto {

    @IsOptional()
    @IsNumber()
    id: number;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    createdAt?: string;

    @IsOptional()
    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    updatedAt?: string;

    @JSONSchema({
        description: 'access token, in JWT format',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    })
    @IsOptional()
    token?: string;
}

export class UserLoginDto {

    @IsString()
    email: string;

    @IsString()
    password: string;
}