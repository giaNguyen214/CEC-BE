import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { N8nChatHistory } from './entities/n8n-chat-history.entity';

@Injectable()
export class ChatManageService {
    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepo: Repository<Conversation>,

        @InjectRepository(N8nChatHistory)
        private readonly historyRepo: Repository<N8nChatHistory>,
    ) {}

    
    async getAllConversationsByMssv(mssv: string): Promise<Conversation[]> {
        return this.conversationRepo.find({
        where: {
            mssv: mssv
        },
        order: {
            created_at: 'DESC',
        },
        });
    }


    async deleteConversation( session_id:string,mssv: string): Promise<string> {
        const convo = await this.conversationRepo.findOneBy({  session_id,mssv });
        if (!convo) return 'Conversation not found';

        await this.conversationRepo.delete({  session_id,mssv });
        await this.historyRepo.delete({  session_id:  session_id });

        return 'Deleted successfully';
    }


    async updateConversationTitle( session_id:string,mssv: string, newTitle: string): Promise<string> {
        const convo = await this.conversationRepo.findOneBy({ session_id,mssv });
        if (!convo) return 'Conversation not found';

        convo.title = newTitle;
        await this.conversationRepo.save(convo);

        return 'Title updated successfully';
    }
    async findMessagesBySessionIdAndMssv(sessionId: string,mssv: string): Promise<N8nChatHistory[]> {
        return await this.historyRepo.find({
        where: { session_id: sessionId, mssv: mssv   },
        order: { id: 'ASC' },
        });
  }
}
