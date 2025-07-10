import { Controller, Get, Patch, Delete, Query, Body, Param } from '@nestjs/common';
import { ChatManageService } from './chat-manage.service';

@Controller('chat-manage')
export class ChatManageController {
  constructor(private readonly chatService: ChatManageService) {}
  @Get('hello')
getHello(): string {
  return 'ChatManageModule is working!';
}
  @Get('conversations/:mssv')
  async getAll(@Param('mssv') mssv: string) {
    try {
      const data = await this.chatService.getAllConversationsByMssv(mssv);
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

  @Delete('conversations/:session_id_mssv')
  async delete(@Param('session_id_mssv') session_id_mssv: string) {
    try {
      const result = await this.chatService.deleteConversation(session_id_mssv);
      return {
        success: true,
        data: result,
        message: '',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'An error occurred while deleting the conversation.',
      };
    }
  }

  @Patch('conversations/:session_id_mssv')
  async patch(@Param('session_id_mssv')session_id_mssv: string,@Body() body: { title: string }) {
    try {
      const { title } = body;
      const result = await this.chatService.updateConversationTitle(session_id_mssv, title);
      return {
        success: true,
        data: result,
        message: '',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'An error occurred while updating the conversation title.',
      };
    }
  }
}
