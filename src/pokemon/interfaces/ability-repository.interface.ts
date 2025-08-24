import { Ability } from '@prisma/client';

export interface IAbilityRepository {
    findAll(name?: string): Promise<Ability[]>;
    findById(id: number): Promise<Ability | null>;
    findByName(name: string): Promise<Ability | null>;
    create(name: string): Promise<Ability>;
}