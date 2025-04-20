import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage } from '../types';
import { generateChatResponse, getChatHistory } from '../lib/openai';

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial welcome message
  useEffect(() => {
    setMessages([
      {
        question: "system",
        answer: "👋 Hi there! I'm John's virtual assistant. How can I help you today? You can ask me about his skills, experience, projects, or background."
      }
    ]);
    
    // Optionally fetch chat history
    // fetchChatHistory();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = useCallback(async () => {
    try {
      const history = await getChatHistory();
      if (history.length > 0) {
        setMessages(prev => [...prev, ...history]);
      }
    } catch (err) {
      console.error('Failed to fetch chat history', err);
      setError('Failed to load chat history');
    }
  }, []);

  const sendMessage = useCallback(async (question: string) => {
    setIsLoading(true);
    setError(null);
    
    // Add user message immediately
    setMessages(prev => [...prev, { question, answer: "", isLoading: true }]);
    
    try {
      const answer = await generateChatResponse(question);
      
      // Update the message with the response
      setMessages(prev => prev.map(msg => 
        msg.question === question && msg.isLoading 
          ? { question, answer, isLoading: false }
          : msg
      ));
    } catch (err) {
      console.error('Failed to get response', err);
      setError('Failed to get a response. Please try again.');
      
      // Update the message with error
      setMessages(prev => prev.map(msg => 
        msg.question === question && msg.isLoading 
          ? { 
              question, 
              answer: "I'm sorry, I'm having trouble processing your request. Please try again.", 
              isLoading: false 
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    messagesEndRef
  };
}
