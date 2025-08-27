import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/library';
import { PokemonService } from '../../src/pokemon/pokemon.service';
import { IPokemonRepository, PaginatedResult } from '../../src/pokemon/interfaces/pokemon-repository.interface';
import { IAbilityRepository } from '../../src/pokemon/interfaces/ability-repository.interface';
import { CreatePokemonDto } from '../../src/dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../../src/dto/update-pokemon.dto';
import { PaginationDto } from '../../src/dto/pagination.dto';
import { PokemonType } from '../../generated/prisma';

describe('PokemonService', () => {
  let service: PokemonService;
  let pokemonRepository: jest.Mocked<IPokemonRepository>;
  let abilityRepository: jest.Mocked<IAbilityRepository>;

  const mockPokemonData = {
    id: 1,
    name: 'Pikachu',
    type: PokemonType.ELECTRIC,
    height: 0.4,
    weight: 6.0,
    imageUrl: 'https://example.com/pikachu.png',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    abilities: [
      {
        ability: { id: 1, name: 'Static' }
      },
      {
        ability: { id: 2, name: 'Lightning Rod' }
      }
    ]
  };

  const mockAbilityData = {
    id: 1,
    name: 'Static'
  };

  const mockPaginatedResult: PaginatedResult<any> = {
    items: [mockPokemonData],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1
  };

  const mockPokemonRepository: Partial<IPokemonRepository> = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByAbility: jest.fn(),
  };

  const mockAbilityRepository: Partial<IAbilityRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: 'IPokemonRepository',
          useValue: mockPokemonRepository,
        },
        {
          provide: 'IAbilityRepository',
          useValue: mockAbilityRepository,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    pokemonRepository = module.get('IPokemonRepository');
    abilityRepository = module.get('IAbilityRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new pokemon successfully', async () => {
      const createDto: CreatePokemonDto = {
        name: 'Pikachu',
        type: PokemonType.ELECTRIC,
        height: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
      };

      pokemonRepository.create.mockResolvedValue(mockPokemonData);

      const result = await service.create(createDto);

      expect(pokemonRepository.create).toHaveBeenCalledWith(createDto);
      expect(pokemonRepository.create).toHaveBeenCalledTimes(1);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Pikachu');
      expect(result.abilities).toHaveLength(2);
    });

    it('should throw ConflictException when pokemon name already exists', async () => {
      const createDto: CreatePokemonDto = {
        name: 'Pikachu',
        type: PokemonType.ELECTRIC,
        height: 0.4,
        weight: 6.0,
      };

      const prismaError = new PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (`name`)',
        { code: 'P2002', clientVersion: '5.0.0' }
      );

      pokemonRepository.create.mockRejectedValue(prismaError);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createDto)).rejects.toThrow('Pokemon with this name already exists');
      expect(pokemonRepository.create).toHaveBeenCalledWith(createDto);
    });

    it('should rethrow non-Prisma errors', async () => {
      const createDto: CreatePokemonDto = {
        name: 'Pikachu',
        type: PokemonType.ELECTRIC,
        height: 0.4,
        weight: 6.0,
      };

      const genericError = new Error('Database connection failed');
      pokemonRepository.create.mockRejectedValue(genericError);

      await expect(service.create(createDto)).rejects.toThrow('Database connection failed');
      expect(pokemonRepository.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle pokemon creation without imageUrl', async () => {
      const createDto: CreatePokemonDto = {
        name: 'Charmander',
        type: PokemonType.FIRE,
        height: 0.6,
        weight: 8.5,
      };

      const pokemonWithoutImage = { ...mockPokemonData, name: 'Charmander', imageUrl: null };
      pokemonRepository.create.mockResolvedValue(pokemonWithoutImage);

      const result = await service.create(createDto);

      expect(result.imageUrl).toBeUndefined();
      expect(result.name).toBe('Charmander');
    });
  });

  describe('findAll', () => {
    it('should return paginated pokemons with default values', async () => {
      const query: PaginationDto = {};
      const expectedFilters = {
        page: 1,
        limit: 10,
        search: undefined,
        type: undefined,
      };

      pokemonRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(query);

      expect(pokemonRepository.findAll).toHaveBeenCalledWith(expectedFilters);
      expect(result.items).toHaveLength(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should return paginated pokemons with custom parameters', async () => {
      const query: PaginationDto = {
        page: '2',
        limit: '5',
        search: 'Pika',
        type: PokemonType.ELECTRIC,
      };
      const expectedFilters = {
        page: 2,
        limit: 5,
        search: 'Pika',
        type: PokemonType.ELECTRIC,
      };

      pokemonRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(query);

      expect(pokemonRepository.findAll).toHaveBeenCalledWith(expectedFilters);
      expect(result.items[0].type).toBe(PokemonType.ELECTRIC);
    });

    it('should enforce maximum limit of 100', async () => {
      const query: PaginationDto = {
        limit: '150', // Should be capped at 100
      };
      const expectedFilters = {
        page: 1,
        limit: 100,
        search: undefined,
        type: undefined,
      };

      pokemonRepository.findAll.mockResolvedValue(mockPaginatedResult);

      await service.findAll(query);

      expect(pokemonRepository.findAll).toHaveBeenCalledWith(expectedFilters);
    });

    it('should handle invalid page and limit values', async () => {
      const query: PaginationDto = {
        page: 'invalid',
        limit: 'invalid',
      };
      const expectedFilters = {
        page: 1, // Should default to 1 for invalid values
        limit: 10, // Should default to 10 for invalid values
        search: undefined,
        type: undefined,
      };

      pokemonRepository.findAll.mockResolvedValue(mockPaginatedResult);

      await service.findAll(query);

      expect(pokemonRepository.findAll).toHaveBeenCalledWith(expectedFilters);
    });

    it('should map pokemon abilities correctly', async () => {
      pokemonRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll({});

      expect(result.items[0].abilities).toEqual([
        { id: 1, name: 'Static' },
        { id: 2, name: 'Lightning Rod' }
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a pokemon by id', async () => {
      pokemonRepository.findById.mockResolvedValue(mockPokemonData);

      const result = await service.findOne(1);

      expect(pokemonRepository.findById).toHaveBeenCalledWith(1);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Pikachu');
      expect(result.abilities).toHaveLength(2);
    });

    it('should throw NotFoundException when pokemon not found', async () => {
      pokemonRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Pokemon with id 999 not found');
      expect(pokemonRepository.findById).toHaveBeenCalledWith(999);
    });

    it('should map abilities correctly in response', async () => {
      pokemonRepository.findById.mockResolvedValue(mockPokemonData);

      const result = await service.findOne(1);

      expect(result.abilities).toEqual([
        { id: 1, name: 'Static' },
        { id: 2, name: 'Lightning Rod' }
      ]);
    });
  });

  describe('update', () => {
    it('should update a pokemon successfully', async () => {
      const updateDto: UpdatePokemonDto = {
        name: 'Raichu',
        weight: 30.0,
      };
      const updatedPokemon = { ...mockPokemonData, name: 'Raichu', weight: 30.0 };

      pokemonRepository.findById.mockResolvedValue(mockPokemonData);
      pokemonRepository.update.mockResolvedValue(updatedPokemon);

      const result = await service.update(1, updateDto);

      expect(pokemonRepository.findById).toHaveBeenCalledWith(1);
      expect(pokemonRepository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result.name).toBe('Raichu');
      expect(result.weight).toBe(30.0);
    });

    it('should throw NotFoundException when pokemon does not exist', async () => {
      const updateDto: UpdatePokemonDto = { name: 'Raichu' };

      pokemonRepository.findById.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
      expect(pokemonRepository.findById).toHaveBeenCalledWith(999);
      expect(pokemonRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when name already exists', async () => {
      const updateDto: UpdatePokemonDto = { name: 'ExistingName' };
      const prismaError = new PrismaClientKnownRequestError(
        'Unique constraint failed',
        { code: 'P2002', clientVersion: '5.0.0' }
      );

      pokemonRepository.findById.mockResolvedValue(mockPokemonData);
      pokemonRepository.update.mockRejectedValue(prismaError);

      await expect(service.update(1, updateDto)).rejects.toThrow(ConflictException);
      expect(pokemonRepository.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should handle partial updates correctly', async () => {
      const updateDto: UpdatePokemonDto = { height: 0.5 };
      const updatedPokemon = { ...mockPokemonData, height: 0.5 };

      pokemonRepository.findById.mockResolvedValue(mockPokemonData);
      pokemonRepository.update.mockResolvedValue(updatedPokemon);

      const result = await service.update(1, updateDto);

      expect(result.height).toBe(0.5);
      expect(result.name).toBe('Pikachu'); // Should remain unchanged
    });
  });

  describe('remove', () => {
    it('should delete a pokemon successfully', async () => {
      pokemonRepository.findById.mockResolvedValue(mockPokemonData);
      pokemonRepository.delete.mockResolvedValue(mockPokemonData);

      const result = await service.remove(1);

      expect(pokemonRepository.findById).toHaveBeenCalledWith(1);
      expect(pokemonRepository.delete).toHaveBeenCalledWith(1);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Pikachu');
    });

    it('should throw NotFoundException when pokemon does not exist', async () => {
      pokemonRepository.findById.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(pokemonRepository.findById).toHaveBeenCalledWith(999);
      expect(pokemonRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('findByAbility', () => {
    it('should return pokemons by ability name', async () => {
      pokemonRepository.findByAbility.mockResolvedValue([mockPokemonData]);

      const result = await service.findByAbility('Static');

      expect(pokemonRepository.findByAbility).toHaveBeenCalledWith('Static');
      expect(result).toHaveLength(1);
      expect(result[0].abilities).toContainEqual({ id: 1, name: 'Static' });
    });

    it('should return empty array when no pokemons found', async () => {
      pokemonRepository.findByAbility.mockResolvedValue([]);

      const result = await service.findByAbility('NonExistent');

      expect(pokemonRepository.findByAbility).toHaveBeenCalledWith('NonExistent');
      expect(result).toEqual([]);
    });
  });
});
