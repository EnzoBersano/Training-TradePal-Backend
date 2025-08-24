
import { Pokemon } from '@prisma/client';
import { CreatePokemonDto } from '../../dtos/create-pokemon.dto';
import { UpdatePokemonDto } from '../../dtos/update-pokemon.dto';

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PokemonFilters {
    search?: string;
    type?: string;
    page?: number;
    limit?: number;
}

export interface IPokemonRepository {
    create(data: CreatePokemonDto): Promise<Pokemon>;
    findAll(filters: PokemonFilters): Promise<PaginatedResult<Pokemon>>;
    findById(id: number): Promise<Pokemon | null>;
    findByName(name: string): Promise<Pokemon | null>;
    update(id: number, data: UpdatePokemonDto): Promise<Pokemon>;
    delete(id: number): Promise<Pokemon>;
    findByAbility(abilityName: string): Promise<Pokemon[]>;
}