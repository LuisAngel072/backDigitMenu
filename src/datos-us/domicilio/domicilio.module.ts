import { Module } from '@nestjs/common';
import { DomicilioService } from './domicilio.service';

@Module({
  providers: [DomicilioService]
})
export class DomicilioModule {}
