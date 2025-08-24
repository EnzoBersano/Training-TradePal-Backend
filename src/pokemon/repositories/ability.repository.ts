import { Injectable } from '@nestjs/common';
import { Ability } from '../../../generated/prisma';
import { PrismaService } from '../../prisma/prisma.service';
import { IAbilityRepository } from '../interfaces/ability-repository.interface';

@Injectable()
export class AbilityRepository implements IAbilityRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(name?: string): Promise<Ability[]> {
        const where = name ? {
            name: {
                contains: name,
                mode: 'insensitive' as const
            }
        } : {};

        return this.prisma.ability.findMany({
            where,
            orderBy: { name: 'asc' }
        });
    }

    async findById(id: number): Promise<Ability | null> {
        return this.prisma.ability.findUnique({
            where: { id }
        });
    }

    async findByName(name: string): Promise<Ability | null> {
        return this.prisma.ability.findUnique({
            where: { name }
        });
    }

    async create(name: string): Promise<Ability> {
        return this.prisma.ability.create({
            data: { name }
        });
    }
}