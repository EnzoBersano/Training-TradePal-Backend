import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Pokemon, Ability } from '../../generated/prisma';
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/library';
import { CreatePokemonDto } from '../dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../dto/update-pokemon.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { PokemonResponseDto, AbilityResponseDto, PaginatedPokemonResponseDto } from '../dto/pokemon-response.dto';
import { IPokemonService } from './interfaces/pokemon-service.interface';
import type { IPokemonRepository, PaginatedResult } from './interfaces/pokemon-repository.interface';
import type { IAbilityRepository } from './interfaces/ability-repository.interface';

@Injectable()
export class PokemonService implements IPokemonService {
    constructor(
        private readonly pokemonRepository: IPokemonRepository,
        private readonly abilityRepository: IAbilityRepository,
    ) {}

    private mapToPokemonResponse(pokemon: any): PokemonResponseDto {
        return {
            id: pokemon.id,
            name: pokemon.name,
            type: pokemon.type,
            height: pokemon.height,
            weight: pokemon.weight,
            imageUrl: pokemon.imageUrl || undefined,
            createdAt: pokemon.createdAt,
            updatedAt: pokemon.updatedAt,
            abilities: pokemon.abilities?.map((pa: any) => ({
                id: pa.ability.id,
                name: pa.ability.name
            })) || undefined
        };
    }

    async create(data: CreatePokemonDto): Promise<PokemonResponseDto> {
        try {
            const pokemon = await this.pokemonRepository.create(data);
            return this.mapToPokemonResponse(pokemon);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Pokemon with this name already exists');
            }
            throw error;
        }
    }

    async findAll(query: PaginationDto): Promise<PaginatedPokemonResponseDto> {
        const filters = {
            page: query.page ? parseInt(query.page) : 1,
            limit: query.limit ? Math.min(parseInt(query.limit), 100) : 10,
            search: query.search,
            type: query.type,
        };

        const result = await this.pokemonRepository.findAll(filters);
        return {
            ...result,
            items: result.items.map(pokemon => this.mapToPokemonResponse(pokemon))
        };
    }

    async findOne(id: number): Promise<PokemonResponseDto> {
        const pokemon = await this.pokemonRepository.findById(id);
        if (!pokemon) {
            throw new NotFoundException(`Pokemon with id ${id} not found`);
        }
        return this.mapToPokemonResponse(pokemon);
    }

    async update(id: number, data: UpdatePokemonDto): Promise<PokemonResponseDto> {
        await this.findOne(id);

        try {
            const pokemon = await this.pokemonRepository.update(id, data);
            return this.mapToPokemonResponse(pokemon);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Pokemon with this name already exists');
            }
            throw error;
        }
    }

    async remove(id: number): Promise<PokemonResponseDto> {
        await this.findOne(id);
        const pokemon = await this.pokemonRepository.delete(id);
        return this.mapToPokemonResponse(pokemon);
    }

    async findByAbility(abilityName: string): Promise<PokemonResponseDto[]> {
        const pokemons = await this.pokemonRepository.findByAbility(abilityName);
        return pokemons.map(pokemon => this.mapToPokemonResponse(pokemon));
    }

    async getAbilitiesByName(name?: string): Promise<AbilityResponseDto[]> {
        const abilities = await this.abilityRepository.findAll(name);
        return abilities.map(ability => ({
            id: ability.id,
            name: ability.name
        }));
    }
}
