import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { LogsdbService } from './logsdb.service';
import { CrLogDto } from './dto/cr-log.dto';
import { Request } from 'express';

@Controller('logsdb')
export class LogsdbController {
  constructor(private readonly logsdbService: LogsdbService) {}
  @Get()
  async getLogs() {
    return await this.logsdbService.getLogs();
  }

  @Get(':id_log')
  async getLog(id_log: number) {
    return await this.logsdbService.getLog(id_log);
  }

  @Post('registrar')
  async crearLog(@Body() logDto: CrLogDto, @Req() req: Request) {
    const ip = req.socket.remoteAddress;
    return await this.logsdbService.crearLog(logDto, ip);
  }
}
