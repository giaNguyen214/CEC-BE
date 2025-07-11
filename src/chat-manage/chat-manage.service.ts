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
            session_id_mssv: ILike(`%_${mssv}`),
        },
        order: {
            created_at: 'DESC',
        },
        });
    }


    async deleteConversation( session_id_mssv: string): Promise<string> {
        const convo = await this.conversationRepo.findOneBy({  session_id_mssv});
        if (!convo) return 'Conversation not found';

        await this.conversationRepo.delete({  session_id_mssv });
        await this.historyRepo.delete({  session_id:  session_id_mssv });

        return 'Deleted successfully';
    }


    async updateConversationTitle( session_id_mssv: string, newTitle: string): Promise<string> {
        const convo = await this.conversationRepo.findOneBy({ session_id_mssv: session_id_mssv });
        if (!convo) return 'Conversation not found';

        convo.title = newTitle;
        await this.conversationRepo.save(convo);

        return 'Title updated successfully';
    }
    async findMessagesBySessionId(sessionId: string) {
        return await this.historyRepo.find({
        where: { session_id: sessionId },
        order: { id: 'ASC' },
        });
  }
}
