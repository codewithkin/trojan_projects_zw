import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * In-memory storage for conversation context
 * In production, this should be backed by Redis or a database
 */
const conversationMemory = new Map<string, ConversationContext>();

interface ConversationContext {
  userId: string;
  sessionId: string;
  facts: string[];
  lastTopics: string[];
  preferences: Record<string, string>;
  lastUpdated: Date;
}

/**
 * Tool to remember important facts from the conversation
 */
export const rememberFactTool = createTool({
  id: "remember-fact",
  description:
    "Remember an important fact or piece of information from the conversation. Use this when the user shares something significant that might be useful later, like their preferred service categories, budget constraints, or specific concerns.",
  inputSchema: z.object({
    sessionId: z.string().describe("The current conversation session ID"),
    fact: z.string().describe("The fact or information to remember"),
    category: z
      .enum(["preference", "constraint", "concern", "context", "followup"])
      .describe("The category of the fact being remembered"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    totalFacts: z.number(),
  }),
  execute: async ({ context }) => {
    const { sessionId, fact, category } = context;

    let memory = conversationMemory.get(sessionId);
    if (!memory) {
      memory = {
        userId: "",
        sessionId,
        facts: [],
        lastTopics: [],
        preferences: {},
        lastUpdated: new Date(),
      };
    }

    // Add the fact with category prefix
    memory.facts.push(`[${category}] ${fact}`);
    memory.lastUpdated = new Date();

    // Keep only the last 20 facts to avoid memory bloat
    if (memory.facts.length > 20) {
      memory.facts = memory.facts.slice(-20);
    }

    conversationMemory.set(sessionId, memory);

    return {
      success: true,
      totalFacts: memory.facts.length,
    };
  },
});

/**
 * Tool to recall previously stored facts
 */
export const recallFactsTool = createTool({
  id: "recall-facts",
  description:
    "Recall previously stored facts and context from this conversation. Use this at the start of analyzing a complex question or when you need to reference earlier context.",
  inputSchema: z.object({
    sessionId: z.string().describe("The current conversation session ID"),
    category: z
      .enum(["preference", "constraint", "concern", "context", "followup", "all"])
      .optional()
      .default("all")
      .describe("Filter facts by category, or 'all' for everything"),
  }),
  outputSchema: z.object({
    facts: z.array(z.string()),
    lastTopics: z.array(z.string()),
    preferences: z.record(z.string(), z.string()),
    hasContext: z.boolean(),
  }),
  execute: async ({ context }) => {
    const { sessionId, category } = context;

    const memory = conversationMemory.get(sessionId);
    if (!memory) {
      return {
        facts: [],
        lastTopics: [],
        preferences: {},
        hasContext: false,
      };
    }

    let facts = memory.facts;
    if (category !== "all") {
      facts = facts.filter((f) => f.startsWith(`[${category}]`));
    }

    return {
      facts,
      lastTopics: memory.lastTopics,
      preferences: memory.preferences,
      hasContext: true,
    };
  },
});

/**
 * Tool to track conversation topics for context
 */
export const trackTopicTool = createTool({
  id: "track-topic",
  description:
    "Track the current topic being discussed. Use this to maintain context about what the conversation is about.",
  inputSchema: z.object({
    sessionId: z.string().describe("The current conversation session ID"),
    topic: z.string().describe("The topic being discussed (e.g., 'revenue analysis', 'customer insights', 'project status')"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    currentTopics: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    const { sessionId, topic } = context;

    let memory = conversationMemory.get(sessionId);
    if (!memory) {
      memory = {
        userId: "",
        sessionId,
        facts: [],
        lastTopics: [],
        preferences: {},
        lastUpdated: new Date(),
      };
    }

    // Add topic and keep last 5 topics
    memory.lastTopics.push(topic);
    if (memory.lastTopics.length > 5) {
      memory.lastTopics = memory.lastTopics.slice(-5);
    }
    memory.lastUpdated = new Date();

    conversationMemory.set(sessionId, memory);

    return {
      success: true,
      currentTopics: memory.lastTopics,
    };
  },
});

/**
 * Tool to save user preferences for personalized responses
 */
export const savePreferenceTool = createTool({
  id: "save-preference",
  description:
    "Save a user preference for personalized responses. Use when the user expresses a preferred format, focus area, or analysis style.",
  inputSchema: z.object({
    sessionId: z.string().describe("The current conversation session ID"),
    key: z.string().describe("The preference key (e.g., 'format', 'focus', 'detail_level')"),
    value: z.string().describe("The preference value"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    preferences: z.record(z.string(), z.string()),
  }),
  execute: async ({ context }) => {
    const { sessionId, key, value } = context;

    let memory = conversationMemory.get(sessionId);
    if (!memory) {
      memory = {
        userId: "",
        sessionId,
        facts: [],
        lastTopics: [],
        preferences: {},
        lastUpdated: new Date(),
      };
    }

    memory.preferences[key] = value;
    memory.lastUpdated = new Date();

    conversationMemory.set(sessionId, memory);

    return {
      success: true,
      preferences: memory.preferences,
    };
  },
});

/**
 * Tool to clear conversation memory (for new sessions)
 */
export const clearMemoryTool = createTool({
  id: "clear-memory",
  description:
    "Clear the conversation memory for a fresh start. Use when the user explicitly asks to start over or reset context.",
  inputSchema: z.object({
    sessionId: z.string().describe("The current conversation session ID"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const { sessionId } = context;

    conversationMemory.delete(sessionId);

    return {
      success: true,
      message: "Conversation memory cleared. Starting fresh!",
    };
  },
});

/**
 * Get summary of current conversation context
 */
export const getContextSummaryTool = createTool({
  id: "get-context-summary",
  description:
    "Get a summary of the current conversation context including remembered facts, topics, and preferences. Use this to provide contextually aware responses.",
  inputSchema: z.object({
    sessionId: z.string().describe("The current conversation session ID"),
  }),
  outputSchema: z.object({
    hasContext: z.boolean(),
    factCount: z.number(),
    topicCount: z.number(),
    preferenceCount: z.number(),
    summary: z.string(),
    lastUpdated: z.string().nullable(),
  }),
  execute: async ({ context }) => {
    const { sessionId } = context;

    const memory = conversationMemory.get(sessionId);
    if (!memory) {
      return {
        hasContext: false,
        factCount: 0,
        topicCount: 0,
        preferenceCount: 0,
        summary: "No previous context available for this conversation.",
        lastUpdated: null,
      };
    }

    const preferenceCount = Object.keys(memory.preferences).length;
    const summary = [
      memory.facts.length > 0
        ? `Remembered ${memory.facts.length} fact(s) from our conversation.`
        : null,
      memory.lastTopics.length > 0
        ? `Recently discussed: ${memory.lastTopics.join(", ")}.`
        : null,
      preferenceCount > 0
        ? `${preferenceCount} preference(s) saved.`
        : null,
    ]
      .filter(Boolean)
      .join(" ");

    return {
      hasContext: true,
      factCount: memory.facts.length,
      topicCount: memory.lastTopics.length,
      preferenceCount,
      summary: summary || "Context initialized but no specific details stored yet.",
      lastUpdated: memory.lastUpdated.toISOString(),
    };
  },
});
