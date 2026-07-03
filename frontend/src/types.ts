export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  snippet?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
  messages: Message[];
}
