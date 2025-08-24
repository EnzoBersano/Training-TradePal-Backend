import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { PokemonRepository } from './repositories/pokemon.repository';
import { AbilityRepository } from './repositories/ability.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PokemonController],
  providers: [
    PokemonService,
    {
      provide: 'IPokemonRepository',
      useClass: PokemonRepository,
    },
    {
      provide: 'IAbilityRepository',
      useClass: AbilityRepository,
    },
    PokemonRepository,
    AbilityRepository,
  ],
  exports: [PokemonService],
})
export class PokemonModule {}
