"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Loader2, Sparkles, RotateCcw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface StreamEvent {
  type: "text" | "done" | "error";
  content?: string;
  fullText?: string;
  error?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

// Suggested prompts for quick start
const suggestedPrompts = [
  { text: "What's the overview of our business today?", icon: "📊" },
  { text: "Show me pending projects that need attention", icon: "⏳" },
  { text: "How's our revenue looking this month?", icon: "💰" },
  { text: "Who are our top customers?", icon: "⭐" },
  { text: "Which services are most popular?", icon: "🔧" },
  { text: "What happened in the last 7 days?", icon: "📅" },
];

export default function AIChatPage() {
  const { token } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const sendMessage = useCallback(
    async (messageText?: string) => {
      const text = messageText || inputValue.trim();
      if (!text || isLoading) return;

      // Clear input immediately
      setInputValue("");

      // Create user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date(),
      };

      // Create placeholder for assistant response
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsLoading(true);

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        // Build messages array for API
        const apiMessages = [...messages, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              messages: apiMessages,
              stream: true,
            }),
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body");
        }

        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data: StreamEvent = JSON.parse(line.slice(6));

                if (data.type === "text" && data.content) {
                  fullContent += data.content;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: fullContent }
                        : msg
                    )
                  );
                } else if (data.type === "done") {
                  // Mark streaming as complete
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, isStreaming: false, content: data.fullText || fullContent }
                        : msg
                    )
                  );
                } else if (data.type === "error") {
                  throw new Error(data.error || "Unknown error");
                }
              } catch (e) {
                // Skip invalid JSON lines
                if (line.trim() !== "data: ") {
                  console.warn("Failed to parse SSE event:", line);
                }
              }
            }
          }
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          // Request was cancelled
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, content: "Request cancelled.", isStreaming: false }
                : msg
            )
          );
        } else {
          console.error("Chat error:", error);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? {
                    ...msg,
                    content: `Sorry, I encountered an error: ${(error as Error).message}. Please try again.`,
                    isStreaming: false,
                  }
                : msg
            )
          );
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [inputValue, isLoading, messages, token]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-gray-200"
        style={{ backgroundColor: `${TROJAN_NAVY}08` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: TROJAN_GOLD }}
          >
            <Bot size={22} style={{ color: TROJAN_NAVY }} />
          </div>
          <div>
            <h2 className="font-semibold" style={{ color: TROJAN_NAVY }}>
              Trojan Business Insights
            </h2>
            <p className="text-xs text-gray-500">
              AI-powered analytics • Ask me anything about your business
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetChat}
            className="gap-2"
          >
            <RotateCcw size={14} />
            New Chat
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
        {messages.length === 0 ? (
          // Empty state with suggestions
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: `${TROJAN_GOLD}20` }}
            >
              <Sparkles size={40} style={{ color: TROJAN_GOLD }} />
            </div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: TROJAN_NAVY }}
            >
              How can I help you today?
            </h3>
            <p className="text-gray-500 text-sm mb-8 text-center max-w-md">
              I can analyze your business data and provide insights on projects,
              revenue, customers, and more.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(prompt.text)}
                  className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-left group"
                >
                  <span className="text-xl">{prompt.icon}</span>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {prompt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Messages list
          <div className="py-6 space-y-6">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onCopy={() => copyToClipboard(message.content, message.id)}
                isCopied={copiedId === message.id}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your business..."
              disabled={isLoading}
              className="resize-none min-h-[52px] max-h-[200px] pr-12 rounded-xl border-gray-200 focus:border-gray-300 focus:ring-0"
              rows={1}
            />
          </div>
          <Button
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="h-[52px] w-[52px] rounded-xl shrink-0"
            style={{
              backgroundColor: inputValue.trim() ? TROJAN_GOLD : "#E5E7EB",
              color: inputValue.trim() ? TROJAN_NAVY : "#9CA3AF",
            }}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-3">
          AI can make mistakes. Verify important information independently.
        </p>
      </div>
    </div>
  );
}

// Message Bubble Component
function MessageBubble({
  message,
  onCopy,
  isCopied,
}: {
  message: ChatMessage;
  onCopy: () => void;
  isCopied: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          isUser ? "bg-gray-700" : ""
        )}
        style={!isUser ? { backgroundColor: TROJAN_GOLD } : {}}
      >
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Bot size={16} style={{ color: TROJAN_NAVY }} />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex-1 max-w-[80%]",
          isUser ? "flex justify-end" : ""
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 relative group",
            isUser
              ? "bg-gray-700 text-white rounded-tr-sm"
              : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
          )}
        >
          {/* Message text with markdown-like formatting */}
          <div className={cn(
            "text-sm leading-relaxed whitespace-pre-wrap",
            message.isStreaming && "min-h-[20px]"
          )}>
            {message.content || (message.isStreaming && (
              <span className="inline-flex items-center gap-1 text-gray-400">
                <Loader2 size={14} className="animate-spin" />
                Thinking...
              </span>
            ))}
            {message.isStreaming && message.content && (
              <span className="inline-block w-2 h-4 bg-current opacity-70 animate-pulse ml-0.5" />
            )}
          </div>

          {/* Copy button for assistant messages */}
          {!isUser && message.content && !message.isStreaming && (
            <button
              onClick={onCopy}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy to clipboard"
            >
              {isCopied ? (
                <Check size={12} className="text-green-600" />
              ) : (
                <Copy size={12} className="text-gray-500" />
              )}
            </button>
          )}
        </div>

        {/* Timestamp */}
        <p
          className={cn(
            "text-xs text-gray-400 mt-1",
            isUser ? "text-right mr-1" : "ml-1"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
