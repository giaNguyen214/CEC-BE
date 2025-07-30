import { Injectable } from '@nestjs/common';
import { CreateQaDto } from './dto/create-qa.dto';
import { UpdateQaDto } from './dto/update-qa.dto';

import { Qa } from './entities/qa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QaService {
  constructor(
    @InjectRepository(Qa)
    private readonly qaRepo: Repository<Qa>,
  ) {}

  async getAllQA(): Promise<Qa[]> {
    return await this.qaRepo.find()
  }

  async getQA(mssv: string): Promise<Qa[]> {
    return await this.qaRepo.find({
      where: {
        mssv: mssv
      },
      order: {
        id: 'ASC'
      }
    })
  }

  async updateQA( id:number ,answer: string): Promise<string> {
    const qa = await this.qaRepo.findOneBy({id});
    if (!qa) return 'Question not found';

    qa.answer = answer;
    await this.qaRepo.save(qa);

    return 'Title updated successfully';
  }
}
