import { Module } from '@nestjs/common';
import { LogsdbService } from './logsdb.service';
import { LogsdbController } from './logsdb.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from './entities/logs.entity';

@Module({
  providers: [LogsdbService],
  controllers: [LogsdbController],
  imports: [TypeOrmModule.forFeature([Logs])],
})
export class LogsdbModule {}
