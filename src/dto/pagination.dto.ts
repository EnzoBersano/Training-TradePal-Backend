import { IsOptional, IsNumberString, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PokemonType } from '../../generated/prisma';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Page number (starting from 1)', default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ description: 'Items per page (1-100)', default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ description: 'Search by pokemon name (case insensitive)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by pokemon type', enum: PokemonType })
  @IsOptional()
  @IsEnum(PokemonType)
  type?: PokemonType;
}
