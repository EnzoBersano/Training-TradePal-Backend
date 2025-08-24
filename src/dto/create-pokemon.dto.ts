import { IsString, IsNumber, IsOptional, MaxLength, IsUrl, Min, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PokemonType } from '@prisma/client';

export class CreatePokemonDto {
    @ApiProperty({ description: 'Pokemon name', maxLength: 50 })
    @IsString()
    @MaxLength(50)
    name: string;

    @ApiProperty({ description: 'Pokemon type', enum: PokemonType })
    @IsEnum(PokemonType)
    type: PokemonType;

    @ApiProperty({ description: 'Pokemon height in meters', minimum: 0 })
    @IsNumber()
    @Min(0)
    height: number;

    @ApiProperty({ description: 'Pokemon weight in kilograms', minimum: 0 })
    @IsNumber()
    @Min(0)
    weight: number;

    @ApiPropertyOptional({ description: 'Pokemon image URL' })
    @IsOptional()
    @IsUrl()
    imageUrl?: string;
}