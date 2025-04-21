import { ChatMessage } from "../types";
import { apiRequest } from "./queryClient";

export async function generateChatResponse(question: string): Promise<string> {
  try {
    const res = await apiRequest("POST", "/api/chat", { question });
    const data = await res.json();
    return data.answer;
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "Sorry, I'm having trouble processing your request right now. Please try again later.";
  }
}

export async function getChatHistory(): Promise<ChatMessage[]> {
  try {
    const res = await fetch("/api/chat/history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
}
