import { Controller, Get, Patch, Delete, Query, Body, Param } from '@nestjs/common';
import { DBManageService } from './db-manage.service';

@Controller('db-manage')
export class DBManageController {
  constructor(private readonly dbManageService: DBManageService) {}
  @Get('hello')
getHello(): string {
  return 'DBManageModule is working!';
}
  
  @Get('all/private_database')
  async getAllPrivateDatabase() {
    try {
      const data = await this.dbManageService.getAllPrivateDatabase();
      return {
        success: true,
        data: data,
        message: '',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'An error occurred while fetching private database records.',
      };
    }
  }
  @Delete('private_database/:hash')
  async deletePrivateDatabase(@Param('hash') hash: string) {
    try {
      const result = await this.dbManageService.deletePrivateDatabase(hash);
      return {
        success: true,
        data: result,
        message: '',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'An error occurred while deleting the private database record.',
      };
    }
  }
}
