"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Send, Bot, User, Loader2, Sparkles, RotateCcw, Copy, Check, AlertCircle, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

// Chat history storage key
const CHAT_HISTORY_KEY = "trojan-ai-chat-history";

// Suggested prompts for quick start - organized by category
const suggestedPrompts = [
  { text: "What's the overview of our business today?", icon: "📊", category: "overview" },
  { text: "Show me pending projects that need attention", icon: "⏳", category: "projects" },
  { text: "How's our revenue looking this month?", icon: "💰", category: "revenue" },
  { text: "Who are our top customers?", icon: "⭐", category: "customers" },
  { text: "Which services are most popular?", icon: "🔧", category: "services" },
  { text: "What happened in the last 7 days?", icon: "📅", category: "activity" },
];

// Quick action follow-ups
const quickFollowUps = [
  "Tell me more about this",
  "What should I prioritize?",
  "Compare to last month",
  "Any recommendations?",
];

// Helper to serialize messages for storage
const serializeMessages = (messages: ChatMessage[]) => 
  messages.map(m => ({
    ...m,
    timestamp: m.timestamp.toISOString(),
  }));

// Helper to deserialize messages from storage
const deserializeMessages = (data: { id: string; role: "user" | "assistant"; content: string; timestamp: string }[]): ChatMessage[] =>
  data.map(m => ({
    ...m,
    timestamp: new Date(m.timestamp),
    isStreaming: false,
  }));

export default function AIChatPage() {
  const { token } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(deserializeMessages(parsed));
          setShowHistory(true);
        }
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      const toSave = messages.filter(m => !m.isStreaming);
      if (toSave.length > 0) {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(serializeMessages(toSave)));
      }
    }
  }, [messages]);

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
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setShowHistory(false);
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
            
            {/* Quick Stats Cards */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <TrendingUp size={16} className="text-green-600" />
                <span className="text-sm text-green-700">Real-time data</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                <Zap size={16} className="text-blue-600" />
                <span className="text-sm text-blue-700">Instant insights</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(prompt.text)}
                  disabled={isLoading}
                  className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-left group disabled:opacity-50"
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
          // Messages list with follow-up suggestions
          <div className="py-6 space-y-6">
            {messages.map((message, index) => (
              <div key={message.id}>
                <MessageBubble
                  message={message}
                  onCopy={() => copyToClipboard(message.content, message.id)}
                  isCopied={copiedId === message.id}
                />
                
                {/* Show quick follow-ups after the last assistant message */}
                {message.role === "assistant" && 
                 !message.isStreaming && 
                 index === messages.length - 1 && 
                 !isLoading && (
                  <div className="flex flex-wrap gap-2 mt-4 ml-11">
                    {quickFollowUps.map((followUp, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(followUp)}
                        className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                      >
                        {followUp}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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

// Message Bubble Component with Markdown Support
const MessageBubble = memo(function MessageBubble({
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
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
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
          "flex-1 max-w-[85%] lg:max-w-[75%]",
          isUser ? "flex flex-col items-end" : ""
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
          {/* Message content */}
          {message.content ? (
            isUser ? (
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
            ) : (
              <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Custom code block rendering
                    code: ({ className, children, ...props }) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800" {...props}>
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    // Custom table rendering
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-3">
                        <table className="min-w-full border-collapse border border-gray-200 text-sm">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-medium text-gray-700">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-200 px-3 py-2">
                        {children}
                      </td>
                    ),
                    // Custom list rendering
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-1 my-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-1 my-2">
                        {children}
                      </ol>
                    ),
                    // Headers
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold text-gray-900 mt-4 mb-2">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-semibold text-gray-900 mt-3 mb-2">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-semibold text-gray-900 mt-2 mb-1">{children}</h3>
                    ),
                    // Paragraphs
                    p: ({ children }) => (
                      <p className="my-2 leading-relaxed">{children}</p>
                    ),
                    // Links
                    a: ({ children, href }) => (
                      <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                    // Blockquotes
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-gray-300 pl-4 my-2 text-gray-600 italic">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                {message.isStreaming && (
                  <span className="inline-block w-2 h-4 bg-gray-400 opacity-70 animate-pulse ml-0.5" />
                )}
              </div>
            )
          ) : (
            message.isStreaming && (
              <div className="flex items-center gap-2 text-gray-400 py-1">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-sm">Analyzing your business data...</span>
              </div>
            )
          )}

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
});
