import { ApiProperty } from '@nestjs/swagger';
import { PokemonType } from '../../generated/prisma';

export class AbilityResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;
}

export class PokemonResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty({ enum: PokemonType })
    type: PokemonType;

    @ApiProperty()
    height: number;

    @ApiProperty()
    weight: number;

    @ApiProperty({ required: false })
    imageUrl?: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ type: [AbilityResponseDto], required: false })
    abilities?: AbilityResponseDto[];
}

export class PaginatedPokemonResponseDto {
    @ApiProperty({ type: [PokemonResponseDto] })
    items: PokemonResponseDto[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    totalPages: number;
}