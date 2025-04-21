import axios from 'axios';

interface Message {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
}

interface CompletionOptions {
  model: string;
  messages: Message[];
  max_tokens?: number;
  temperature?: number;
  response_format?: { type: string };
}

interface CompletionResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class OpenRouter {
  private apiKey: string;
  private baseUrl: string;

  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://openrouter.ai/api/v1';
  }

  async chat(options: CompletionOptions): Promise<CompletionResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: options.model,
          messages: options.messages,
          max_tokens: options.max_tokens,
          temperature: options.temperature,
          response_format: options.response_format
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://skill-profile.replit.app', // Replace with your site URL
            'X-Title': 'Skill Profile'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw error;
    }
  }
}

export const createOpenRouter = (apiKey: string) => {
  return {
    chat: {
      completions: {
        create: async (options: CompletionOptions) => {
          const openRouter = new OpenRouter({ apiKey });
          return openRouter.chat(options);
        }
      }
    }
  };
};