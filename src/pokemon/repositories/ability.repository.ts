import { Injectable } from '@nestjs/common';
import { Pokemon } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePokemonDto } from '../../dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../../dto/update-pokemon.dto';
import { IPokemonRepository, PaginatedResult, PokemonFilters } from '../interfaces/pokemon-repository.interface';

@Injectable()
export class PokemonRepository implements IPokemonRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreatePokemonDto): Promise<Pokemon> {
        return this.prisma.pokemon.create({ data });
    }

    async findAll(filters: PokemonFilters): Promise<PaginatedResult<Pokemon>> {
        const page = filters.page || 1;
        const limit = Math.min(filters.limit || 10, 100); // Max 100 items per page
        const skip = (page - 1) * limit;

        const where: any = {};

        if (filters.search) {
            where.name = { contains: filters.search, mode: 'insensitive' };
        }

        if (filters.type) {
            where.type = { equals: filters.type };
        }

        const [items, total] = await Promise.all([
            this.prisma.pokemon.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: 'asc' },
                include: {
                    abilities: {
                        include: {
                            ability: true
                        }
                    }
                }
            }),
            this.prisma.pokemon.count({ where }),
        ]);

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findById(id: number): Promise<Pokemon | null> {
        return this.prisma.pokemon.findUnique({
            where: { id },
            include: {
                abilities: {
                    include: {
                        ability: true
                    }
                }
            }
        });
    }

    async findByName(name: string): Promise<Pokemon | null> {
        return this.prisma.pokemon.findUnique({
            where: { name },
            include: {
                abilities: {
                    include: {
                        ability: true
                    }
                }
            }
        });
    }

    async update(id: number, data: UpdatePokemonDto): Promise<Pokemon> {
        return this.prisma.pokemon.update({
            where: { id },
            data,
            include: {
                abilities: {
                    include: {
                        ability: true
                    }
                }
            }
        });
    }

    async delete(id: number): Promise<Pokemon> {
        return this.prisma.pokemon.delete({
            where: { id },
            include: {
                abilities: {
                    include: {
                        ability: true
                    }
                }
            }
        });
    }

    async findByAbility(abilityName: string): Promise<Pokemon[]> {
        return this.prisma.pokemon.findMany({
            where: {
                abilities: {
                    some: {
                        ability: {
                            name: {
                                equals: abilityName,
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            },
            include: {
                abilities: {
                    include: {
                        ability: true
                    }
                }
            }
        });
    }
}