// src/mesas/mesas.controller.ts
import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { MesasService } from './mesas.service';
import { CreateMesaDto } from './dto/create-mesa.dto';

@Controller('mesas')
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Post()
  create(@Body() dto: CreateMesaDto) {
    return this.mesasService.create(dto);
  }

  @Delete(':no_mesa')
  remove(@Param('no_mesa') no_mesa: number) {
    return this.mesasService.remove(Number(no_mesa));
  }
}
