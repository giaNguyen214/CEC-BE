import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiFilterService {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  async filterContentWithAI(prompt: string): Promise<{
    hasSensitiveContent: boolean;
    violations: string[];
  }> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `
Bạn là một trình kiểm duyệt nội dung. Hãy phân tích đoạn văn dưới đây và trả lời theo cấu trúc JSON:
- "hasSensitiveContent": true nếu có bất kỳ nội dung nhạy cảm nào (xem danh sách bên dưới), hoặc false nếu an toàn
- "violations": liệt kê các dạng nội dung nhạy cảm phát hiện được trong đoạn văn (ví dụ: "mật khẩu", "tài khoản", "email", "mã số sinh viên", "API key")

Trả lời đúng cấu trúc JSON như sau:

{
  "hasSensitiveContent": boolean,
  "violations": [array of strings]
}
    `;

    const result = await model.generateContent([
      systemPrompt,
      `Nội dung: """${prompt}"""`,
    ]);

    const text = (await result.response).text();

    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonPart = text.slice(jsonStart, jsonEnd);
      const parsed = JSON.parse(jsonPart);

      return {
        hasSensitiveContent: parsed.hasSensitiveContent ?? false,
        violations: parsed.violations ?? [],
      };
    } catch (err) {
      console.warn('⚠️ Lỗi parse Gemini JSON:', err);
      return {
        hasSensitiveContent: false,
        violations: [],
      };
    }
  }
}
