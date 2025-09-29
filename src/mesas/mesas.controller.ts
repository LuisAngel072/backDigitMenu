// src/mesas/mesas.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { MesasService } from './mesas.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { Mesa } from './entities/mesa.entity';

@Controller('mesas')
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Post()
  create(@Body() dto: CreateMesaDto) {
    return this.mesasService.create(dto);
  }

  @Get()
  findAll(): Promise<Mesa[]> {
    return this.mesasService.findAll();
  }

  @Get(':no_mesa')
  async findOne(@Param('no_mesa') no_mesa: number): Promise<Mesa> {
    const mesa = await this.mesasService.findOne(Number(no_mesa));
    if (!mesa) {
      throw new NotFoundException(`Mesa con número ${no_mesa} no encontrada`);
    }
    return mesa;
  }

  @Delete(':no_mesa')
  remove(@Param('no_mesa') no_mesa: number) {
    return this.mesasService.remove(Number(no_mesa));
  }
}
