import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePokemonDto } from '../dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreatePokemonDto) {
        return this.prisma.pokemon.create({ data });
    }

    async findAll(query: any) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (query.search) {
            where.name = { contains: query.search, mode: 'insensitive' };
        }
        if (query.type) {
            where.type = { equals: query.type };
        }

        const [items, total] = await Promise.all([
            this.prisma.pokemon.findMany({ where, skip, take: limit }),
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

    async findOne(id: number) {
        const pokemon = await this.prisma.pokemon.findUnique({ where: { id } });
        if (!pokemon) throw new NotFoundException('Pokemon not found');
        return pokemon;
    }

    async update(id: number, data: UpdatePokemonDto) {
        await this.findOne(id);
        return this.prisma.pokemon.update({ where: { id }, data });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.pokemon.delete({ where: { id } });
    }


    async findByAbility(ability: string) {

        return this.prisma.pokemon.findMany({
            where: { abilities: { some: { name: ability } } },
        });
    }    async getAbilitiesByName(name?: string) {
        const where = name ? { name: { contains: name, mode: 'insensitive' } } : {};
        return this.prisma.ability.findMany({ where });
    }
}

