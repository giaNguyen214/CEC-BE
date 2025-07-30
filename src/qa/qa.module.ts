import { Module } from '@nestjs/common';
import { QaService } from './qa.service';
import { QaController } from './qa.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Qa } from './entities/qa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Qa])],
  controllers: [QaController],
  providers: [QaService],
})
export class QaModule {}
