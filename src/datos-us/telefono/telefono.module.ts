import { Module } from '@nestjs/common';
import { TelefonoService } from './telefono.service';
import { Telefonos } from './entities/telefono.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Telefonos])],
  providers: [TelefonoService],
  exports: [TelefonoService],
})
export class TelefonoModule {}
