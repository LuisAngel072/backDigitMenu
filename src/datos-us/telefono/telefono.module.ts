import { Module } from '@nestjs/common';
import { TelefonosService } from './telefonos/telefonos.service';
import { Service } from './.service';
import { TelefonoService } from './telefono.service';

@Module({
  providers: [TelefonosService, Service, TelefonoService]
})
export class TelefonoModule {}
