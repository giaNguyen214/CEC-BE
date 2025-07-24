import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';

import { PrivateDatabase } from './entities/private_database';
@Injectable()
export class DBManageService {
    constructor(
        @InjectRepository(PrivateDatabase)
        private readonly privateDatabaseRepo: Repository<PrivateDatabase>,
    ) {}

  async getAllPrivateDatabase(mssv: string): Promise<PrivateDatabase[]> {
    return await this.privateDatabaseRepo.find({ where: { mssv } });
  }

  async deletePrivateDatabase(hash: string): Promise<string> {
    const record = await this.privateDatabaseRepo.findOneBy({ hash });
    if (!record) return 'Private database record not found';

    await this.privateDatabaseRepo.delete({ hash });
    return 'Deleted successfully';
  }
}
