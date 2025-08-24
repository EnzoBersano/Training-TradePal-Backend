import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    ParseIntPipe,
    HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { IPokemonService } from './interfaces/pokemon-service.interface';
import { CreatePokemonDto } from '../dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../dto/update-pokemon.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { PokemonResponseDto, PaginatedPokemonResponseDto, AbilityResponseDto } from '../dto/pokemon-response.dto';

@ApiTags('Pokemons')
@Controller()
export class PokemonController {
    constructor(private readonly pokemonService: IPokemonService) {}

    @Post('pokemons')
    @ApiOperation({ summary: 'Create a new pokemon' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Pokemon created successfully', type: PokemonResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Pokemon with this name already exists' })
    async create(@Body() dto: CreatePokemonDto): Promise<PokemonResponseDto> {
        return this.pokemonService.create(dto);
    }

    @Get('pokemons')
    @ApiOperation({ summary: 'Get all pokemons with pagination and filtering' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10, max: 100)' })
    @ApiQuery({ name: 'search', required: false, description: 'Search by name (case insensitive)' })
    @ApiQuery({ name: 'type', required: false, description: 'Filter by pokemon type' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Pokemons retrieved successfully', type: PaginatedPokemonResponseDto })
    async findAll(@Query() query: PaginationDto): Promise<PaginatedPokemonResponseDto> {
        return this.pokemonService.findAll(query);
    }

    @Get('pokemons/:id')
    @ApiOperation({ summary: 'Get a pokemon by id' })
    @ApiParam({ name: 'id', description: 'Pokemon ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Pokemon found', type: PokemonResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Pokemon not found' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<PokemonResponseDto> {
        return this.pokemonService.findOne(id);
    }

    @Patch('pokemons/:id')
    @ApiOperation({ summary: 'Update a pokemon by id' })
    @ApiParam({ name: 'id', description: 'Pokemon ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Pokemon updated successfully', type: PokemonResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Pokemon not found' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Pokemon with this name already exists' })
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePokemonDto): Promise<PokemonResponseDto> {
        return this.pokemonService.update(id, dto);
    }

    @Delete('pokemons/:id')
    @ApiOperation({ summary: 'Delete a pokemon by id' })
    @ApiParam({ name: 'id', description: 'Pokemon ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Pokemon deleted successfully', type: PokemonResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Pokemon not found' })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<PokemonResponseDto> {
        return this.pokemonService.remove(id);
    }

    @Get('abilities/pokemons')
    @ApiOperation({ summary: 'Get pokemons by ability name' })
    @ApiQuery({ name: 'ability', description: 'Ability name' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Pokemons found', type: [PokemonResponseDto] })
    async findByAbility(@Query('ability') ability: string): Promise<PokemonResponseDto[]> {
        return this.pokemonService.findByAbility(ability);
    }

    @Get('abilities')
    @ApiOperation({ summary: 'Get all abilities or search by name' })
    @ApiQuery({ name: 'name', required: false, description: 'Search abilities by name (case insensitive)' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Abilities found', type: [AbilityResponseDto] })
    async getAbilities(@Query('name') name?: string): Promise<AbilityResponseDto[]> {
        return this.pokemonService.getAbilitiesByName(name);
    }
}

