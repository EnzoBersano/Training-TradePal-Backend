import { IsString, IsNumber, IsOptional, MaxLength, IsUrl, Min } from 'class-validator';

export class CreatePokemonDto {
    @IsString()
    @MaxLength(50)
    name: string;

    @IsString()
    type: string;

    @IsNumber()
    @Min(0)
    height: number;

    @IsNumber()
    @Min(0)
    weight: number;

    @IsOptional()
    @IsUrl()
    imageUrl?: string;
}
