import { Pokemon, Ability } from '@prisma/client';
import { CreatePokemonDto } from '../../dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../../dto/update-pokemon.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { PaginatedResult } from './pokemon-repository.interface';

export interface IPokemonService {
    create(data: CreatePokemonDto): Promise<Pokemon>;
    findAll(query: PaginationDto): Promise<PaginatedResult<Pokemon>>;
    findOne(id: number): Promise<Pokemon>;
    update(id: number, data: UpdatePokemonDto): Promise<Pokemon>;
    remove(id: number): Promise<Pokemon>;
    findByAbility(ability: string): Promise<Pokemon[]>;
    getAbilitiesByName(name?: string): Promise<Ability[]>;
}