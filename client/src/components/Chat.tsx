import { useState, useRef, useEffect } from "react";
import { useChatbot } from "@/hooks/useChatbot";
import { PORTFOLIO_OWNER } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import { Send } from "lucide-react";

const Chat = () => {
  const { messages, isLoading, sendMessage, messagesEndRef } = useChatbot();
  const [question, setQuestion] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    sendMessage(question);
    setQuestion("");
  };

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <section
      id="chat"
      className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 to-blue-50"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Ask Me About My Experience
        </h2>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Have a question about my skills, experience, or projects? Ask below
          and I'll provide detailed answers based on my background.
        </p>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-800">
              Interactive Chat Assistant
            </h3>
            <p className="text-sm text-gray-500">
              Powered by RAG technology to answer questions about my experience
            </p>
          </div>

          <div className="p-4 h-80 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.question !== "system" && "justify-end"} mb-4`}
              >
                {message.question === "system" ? (
                  <>
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {getInitials(PORTFOLIO_OWNER.name)}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                      <p className="text-gray-800">{message.answer}</p>
                    </div>
                  </>
                ) : message.isLoading ? (
                  <>
                    <div className="bg-blue-500 p-3 rounded-lg shadow-sm max-w-[80%]">
                      <p className="text-white">{message.question}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-end gap-2">
                      <div className="bg-blue-500 p-3 rounded-lg shadow-sm max-w-[100%]">
                        <p className="text-white">{message.question}</p>
                      </div>
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                            {getInitials(PORTFOLIO_OWNER.name)}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                          {message.isLoading ? (
                            <p className="text-gray-800">
                              <span className="inline-block animate-pulse">
                                ...
                              </span>
                            </p>
                          ) : (
                            <p className="text-gray-800">{message.answer}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex mb-4">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {getInitials(PORTFOLIO_OWNER.name)}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm animate-pulse">
                  <p className="text-gray-800">
                    Thinking<span className="inline-block dots">...</span>
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                ref={inputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Type your question here..."
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`
                  ${isLoading ? "bg-gray-400" : "bg-primary hover:bg-blue-600"} 
                  text-white px-4 py-2 rounded-r-md transition-colors
                `}
                disabled={isLoading}
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Prefer direct contact? Reach out via{" "}
            <a
              href={`mailto:${PORTFOLIO_OWNER.email}`}
              className="text-primary hover:underline"
            >
              {PORTFOLIO_OWNER.email}
            </a>{" "}
            or connect on
            <a
              href={PORTFOLIO_OWNER.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .dots::after {
          content: "...";
          animation: typing 1.5s infinite;
        }
        @keyframes typing {
          0%,
          100% {
            content: ".";
          }
          33% {
            content: "..";
          }
          66% {
            content: "...";
          }
        }
      `}</style>
    </section>
  );
};

export default Chat;
