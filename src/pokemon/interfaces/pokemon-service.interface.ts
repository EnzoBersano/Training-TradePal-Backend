
import { CreatePokemonDto } from '../../dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../../dto/update-pokemon.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { PokemonResponseDto, AbilityResponseDto, PaginatedPokemonResponseDto } from '../../dto/pokemon-response.dto';

export interface IPokemonService {
    create(data: CreatePokemonDto): Promise<PokemonResponseDto>;
    findAll(query: PaginationDto): Promise<PaginatedPokemonResponseDto>;
    findOne(id: number): Promise<PokemonResponseDto>;
    update(id: number, data: UpdatePokemonDto): Promise<PokemonResponseDto>;
    remove(id: number): Promise<PokemonResponseDto>;
    findByAbility(ability: string): Promise<PokemonResponseDto[]>;
    getAbilitiesByName(name?: string): Promise<AbilityResponseDto[]>;
}