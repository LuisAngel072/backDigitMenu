import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { Email } from './entities/email.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Email])],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
