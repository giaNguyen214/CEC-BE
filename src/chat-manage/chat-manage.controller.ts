import { Controller, Get, Patch, Delete, Query, Body, Param } from '@nestjs/common';
import { ChatManageService } from './chat-manage.service';
import { session } from 'passport';

@Controller('chat-manage')
export class ChatManageController {
  constructor(private readonly chatManageService: ChatManageService) {}
  @Get('hello')
getHello(): string {
  return 'ChatManageModule is working!';
}
  @Get('conversations/:mssv')
  async getAll(@Param('mssv') mssv: string) {
    try {
      const data = await this.chatManageService.getAllConversationsByMssv(mssv);
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
      // Split sessionid_mssv into sessionId and mssv
      const match = session_id_mssv.match(/^(.+)_(\d{7})$/);
      if (!match) {
        return {
          success: false,
          data: null,
          message: 'Invalid session_id_mssv format. Expected format: sessionId_mssv',
        };
      }
      
      const session_id = match[1];  // e.g., "abc"
      const mssv = match[2];       // e.g., "2212344"
      
      const result = await this.chatManageService.deleteConversation(session_id,mssv);
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
      // Split sessionid_mssv into sessionId and mssv
      const match = session_id_mssv.match(/^(.+)_(\d{7})$/);
      if (!match) {
        return {
          success: false,
          data: null,
          message: 'Invalid session_id_mssv format. Expected format: sessionId_mssv',
        };
      }
      
      const session_id = match[1];  // e.g., "abc"
      const mssv = match[2];       // e.g., "2212344"
      const { title } = body;
      const result = await this.chatManageService.updateConversationTitle(session_id,mssv, title);
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
  @Get('history/:session_id_mssv')
  async getHistoryBySession(@Param('session_id_mssv') session_id_mssv: string) {
    try {
      // Combine session_id and mssv back with underscore to get the full identifier
      const fullSessionId = `${session_id_mssv}`;

      // Split by underscore to get actual session ID and mssv
      const parts = fullSessionId.split('_');
      const actualSessionId = parts.slice(0, -1).join('_'); // Everything except last part
      const actualMssv = parts[parts.length - 1]; // Last part is mssv
      
      const messages = await this.chatManageService.findMessagesBySessionIdAndMssv(actualSessionId, actualMssv);
      return {
        success: true,
        data: { messages, mssv: actualMssv },
        message: '',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'An error occurred while fetching chat history.',
      };
    }
  }
}
