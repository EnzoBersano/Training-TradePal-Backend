import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from '../dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../dto/update-pokemon.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Controller()
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) {}

    @Post('pokemons')
    create(@Body() dto: CreatePokemonDto) {
        return this.pokemonService.create(dto);
    }

    @Get('pokemons')
    findAll(@Query() query: PaginationDto) {
        return this.pokemonService.findAll(query);
    }

    @Get('pokemons/:id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.pokemonService.findOne(id);
    }

    @Patch('pokemons/:id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePokemonDto) {
        return this.pokemonService.update(id, dto);
    }//usar promise await cuando hagamos estos

    @Delete('pokemons/:id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.pokemonService.remove(id);
    }

    @Get('abilities/pokemons')
    findByAbility(@Query('ability') ability: string) {
        return this.pokemonService.findByAbility(ability);
    }

    @Get('abilities')
    getAbilities(@Query('name') name?: string) {
        return this.pokemonService.getAbilitiesByName(name);
    }
}

