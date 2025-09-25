import { Module } from '@nestjs/common';
import { RfcService } from './rfc.service';
import { RFC } from './entities/rfc.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RFC])],
  providers: [RfcService],
  exports: [RfcService],
})
export class RfcModule {}
