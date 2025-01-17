import { Module } from '@nestjs/common';
import { NssService } from './nss.service';

@Module({
  providers: [NssService]
})
export class NssModule {}
