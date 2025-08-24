import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Pokemon, Ability } from '../../generated/prisma';
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/library';
import { CreatePokemonDto } from '../dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../dto/update-pokemon.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { IPokemonService } from './interfaces/pokemon-service.interface';
import type { IPokemonRepository, PaginatedResult } from './interfaces/pokemon-repository.interface';
import type { IAbilityRepository } from './interfaces/ability-repository.interface';

@Injectable()
export class PokemonService implements IPokemonService {
    constructor(
        private readonly pokemonRepository: IPokemonRepository,
        private readonly abilityRepository: IAbilityRepository,
    ) {}

    async create(data: CreatePokemonDto): Promise<Pokemon> {
        try {
            return await this.pokemonRepository.create(data);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Pokemon with this name already exists');
            }
            throw error;
        }
    }

    async findAll(query: PaginationDto): Promise<PaginatedResult<Pokemon>> {
        const filters = {
            page: query.page ? parseInt(query.page) : 1,
            limit: query.limit ? Math.min(parseInt(query.limit), 100) : 10,
            search: query.search,
            type: query.type,
        };

        return this.pokemonRepository.findAll(filters);
    }

    async findOne(id: number): Promise<Pokemon> {
        const pokemon = await this.pokemonRepository.findById(id);
        if (!pokemon) {
            throw new NotFoundException(`Pokemon with id ${id} not found`);
        }
        return pokemon;
    }

    async update(id: number, data: UpdatePokemonDto): Promise<Pokemon> {

        await this.findOne(id);

        try {
            return await this.pokemonRepository.update(id, data);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Pokemon with this name already exists');
            }
            throw error;
        }
    }

    async remove(id: number): Promise<Pokemon> {

        await this.findOne(id);

        return this.pokemonRepository.delete(id);
    }

    async findByAbility(abilityName: string): Promise<Pokemon[]> {
        return this.pokemonRepository.findByAbility(abilityName);
    }

    async getAbilitiesByName(name?: string): Promise<Ability[]> {
        return this.abilityRepository.findAll(name);
    }
}
