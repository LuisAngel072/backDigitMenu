import { Module } from '@nestjs/common';
import { RfcService } from './rfc.service';

@Module({
  providers: [RfcService]
})
export class RfcModule {}
