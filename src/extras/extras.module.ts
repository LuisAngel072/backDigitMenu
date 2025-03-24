import { Module } from '@nestjs/common';
import { ExtrasController } from './extras.controller';
import { ExtrasService } from './extras.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Extras } from './entities/extras.entity';

@Module({
  controllers: [ExtrasController],
  providers: [ExtrasService],
  imports: [TypeOrmModule.forFeature([Extras])],
})
export class ExtrasModule {}
