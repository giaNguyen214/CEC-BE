import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QaService } from './qa.service';
import { CreateQaDto } from './dto/create-qa.dto';
import { UpdateQaDto } from './dto/update-qa.dto';

@Controller('qa')
export class QaController {
  constructor(private readonly qaService: QaService) {}
  @Get('hello')
  getHello(): string {
    return 'QAModule is working!';
  }

  @Get('/')
  async findAll() {
    return await this.qaService.getAllQA();
  }

  @Get('/:mssv')
  async findOne(@Param('mssv') mssv: string) {
    try {
      const data = await this.qaService.getQA(mssv);
      return {
        success: true,
        data: data,
        message: '',
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'An error occurred while fetching conversations.',
      };
    }
  }

  @Patch('/:id')
  async patch(@Param('id') id: number, @Body() body: { answer: string }) {
    try {
      const { answer } = body;
      const result = await this.qaService.updateQA( id, answer);
      return {
        success: true,
        data: result,
        message: '',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'An error occurred while updating the answer of question.',
      };
    }
  }
  
}
