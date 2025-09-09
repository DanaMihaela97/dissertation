export interface ChatSession {
   id: number;
   finished: boolean;
   conversationHistory: string;
   answersJson?: string;
   aiQuestionsCount: number;
   currentQuestionIndex: number;
}
