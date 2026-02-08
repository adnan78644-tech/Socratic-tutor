
export type Role = 'user' | 'model';

export interface ChatMessage {
  role: Role;
  text: string;
  image?: string; // base64 string
}

export interface GeminiResponse {
  text: string;
  error?: string;
}
