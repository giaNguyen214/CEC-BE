import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBManageService } from './db-manage.service';
import { DBManageController  } from './db-manage.controller';
import { PrivateDatabase } from './entities/private_database';
@Module({
    imports: [TypeOrmModule.forFeature([ PrivateDatabase])],
    controllers: [DBManageController],
    providers: [DBManageService],

})
export class DBManageModule {}
