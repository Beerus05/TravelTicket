import { askTravelAI } from './api';

export const aiService = {
  // Gửi câu hỏi tư vấn lịch trình & vé cho AI
  askAssistant: async (prompt: string, availableTickets: any[]) => {
    return await askTravelAI(prompt, availableTickets);
  },
};

export default aiService;

