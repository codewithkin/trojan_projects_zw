import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Topics and keywords that are relevant to Trojan Projects business
 */
const ALLOWED_TOPICS = [
  // Business operations
  "projects", "project", "quotes", "quote", "revenue", "sales", "profit", "income",
  "customers", "customer", "clients", "client", "users", "user",
  "services", "service", "category", "categories",
  "performance", "analytics", "insights", "metrics", "kpi", "dashboard",
  "status", "pending", "completed", "in progress", "cancelled",
  
  // Services offered
  "solar", "electrical", "plumbing", "hvac", "construction", "painting",
  "gardening", "welding", "cctv", "security", "water", "renovation",
  
  // Business concepts
  "booking", "scheduling", "appointment", "estimate", "pricing",
  "rating", "review", "feedback", "satisfaction",
  "team", "staff", "employees", "workers", "technicians",
  "location", "area", "region", "zimbabwe", "harare", "bulawayo", "mutare",
  
  // Time periods
  "today", "week", "month", "quarter", "year", "daily", "weekly", "monthly",
  "trend", "growth", "decline", "comparison",
  
  // Actions
  "analyze", "show", "tell", "explain", "summarize", "compare", "list",
  "find", "search", "get", "report", "overview", "breakdown",
  
  // General business
  "business", "company", "trojan", "operations", "activity", "summary",
];

/**
 * Topics that are explicitly off-limits
 */
const BLOCKED_TOPICS = [
  // Personal/private data misuse
  "password", "passwords", "hack", "hacking", "exploit", "vulnerability",
  "sql injection", "xss", "security hole",
  
  // Unrelated topics
  "politics", "election", "voting", "government",
  "religion", "religious", "church", "mosque",
  "dating", "romance", "relationship",
  "gambling", "casino", "betting",
  "drugs", "narcotics", "illegal",
  
  // Competitor analysis (keep focus on own business)
  "competitor", "competition", "rival",
  
  // Harmful content
  "weapon", "violence", "attack", "terrorism",
  
  // Off-topic tech
  "crypto", "cryptocurrency", "bitcoin", "nft", "blockchain",
  "stock market", "trading", "forex",
  
  // General off-topic
  "recipe", "cooking", "food",
  "movie", "film", "entertainment",
  "game", "gaming", "video game",
  "sports", "football", "soccer", "cricket",
  "weather", "climate",
];

/**
 * Check if a message is on-topic for business analytics
 */
function isOnTopic(message: string): { isValid: boolean; reason?: string } {
  const lowerMessage = message.toLowerCase();
  
  // Check for blocked topics first
  for (const blocked of BLOCKED_TOPICS) {
    if (lowerMessage.includes(blocked)) {
      return {
        isValid: false,
        reason: `This topic ("${blocked}") is outside the scope of business analytics. I'm here to help with Trojan Projects business insights and data.`,
      };
    }
  }
  
  // Check if message contains any allowed topic keywords
  const hasAllowedTopic = ALLOWED_TOPICS.some(topic => 
    lowerMessage.includes(topic)
  );
  
  // Common question words that might precede business queries
  const hasQuestionIntent = /^(what|how|show|tell|give|explain|analyze|compare|list|find|get|can you|could you|please)/i.test(message.trim());
  
  // Greetings and basic interaction are always allowed
  const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening|thanks|thank you|bye|goodbye)/i.test(message.trim());
  
  if (isGreeting || hasAllowedTopic || hasQuestionIntent) {
    return { isValid: true };
  }
  
  // If no clear business context, still allow but track
  return { isValid: true };
}

/**
 * Input guardrail tool to validate incoming messages
 */
export const validateInputTool = createTool({
  id: "validate-input",
  description:
    "Validates that the user's input is relevant to business analytics and within scope. Call this before processing any user request to ensure the conversation stays on-topic.",
  inputSchema: z.object({
    userMessage: z.string().describe("The user's input message to validate"),
  }),
  outputSchema: z.object({
    isValid: z.boolean(),
    reason: z.string().optional(),
    suggestedResponse: z.string().optional(),
    topicsDetected: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    const { userMessage } = context;
    
    const validation = isOnTopic(userMessage);
    const lowerMessage = userMessage.toLowerCase();
    
    // Detect which business topics are mentioned
    const topicsDetected = ALLOWED_TOPICS.filter(topic => 
      lowerMessage.includes(topic)
    );
    
    if (!validation.isValid) {
      return {
        isValid: false,
        reason: validation.reason,
        suggestedResponse: `I'm Trojan's business analytics assistant, focused on helping you understand your project data, customer insights, revenue trends, and service performance. ${validation.reason} 

Here are some things I can help you with:
• Project statistics and status breakdowns
• Revenue analysis by period or category
• Customer insights and top performers
• Service performance metrics
• Recent business activity`,
        topicsDetected: [],
      };
    }
    
    return {
      isValid: true,
      topicsDetected,
    };
  },
});

/**
 * Output guardrail to ensure responses stay professional and on-topic
 */
export const validateOutputTool = createTool({
  id: "validate-output",
  description:
    "Validates that the AI's response is appropriate, professional, and on-topic. Use this to check responses before sending.",
  inputSchema: z.object({
    response: z.string().describe("The AI response to validate"),
  }),
  outputSchema: z.object({
    isAppropriate: z.boolean(),
    concerns: z.array(z.string()),
    suggestion: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { response } = context;
    const lowerResponse = response.toLowerCase();
    const concerns: string[] = [];
    
    // Check for potentially inappropriate content in response
    const sensitivePatterns = [
      { pattern: /password/i, concern: "Contains password references" },
      { pattern: /\b(hack|exploit|vulnerability)\b/i, concern: "Contains security-sensitive terms" },
      { pattern: /personal.*(address|phone|ssn|bank)/i, concern: "May expose personal data" },
    ];
    
    for (const { pattern, concern } of sensitivePatterns) {
      if (pattern.test(response)) {
        concerns.push(concern);
      }
    }
    
    // Check response length (too short might be unhelpful)
    if (response.length < 20 && !response.toLowerCase().includes("no data")) {
      concerns.push("Response may be too brief to be helpful");
    }
    
    // Check for off-topic drift
    const hasBusinessContext = ALLOWED_TOPICS.some(topic => 
      lowerResponse.includes(topic)
    );
    
    if (!hasBusinessContext && response.length > 100) {
      concerns.push("Response may have drifted off-topic from business analytics");
    }
    
    return {
      isAppropriate: concerns.length === 0,
      concerns,
      suggestion: concerns.length > 0 
        ? "Consider revising the response to focus on business data and analytics."
        : undefined,
    };
  },
});

/**
 * Rate limiting guardrail (simple implementation)
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimitTool = createTool({
  id: "check-rate-limit",
  description:
    "Check if the current session has exceeded rate limits. Helps prevent abuse.",
  inputSchema: z.object({
    sessionId: z.string().describe("The session ID to check"),
    maxRequestsPerMinute: z.number().optional().default(20),
  }),
  outputSchema: z.object({
    allowed: z.boolean(),
    currentCount: z.number(),
    limit: z.number(),
    resetsIn: z.number(),
  }),
  execute: async ({ context }) => {
    const { sessionId, maxRequestsPerMinute } = context;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    
    let record = requestCounts.get(sessionId);
    
    // Reset if window expired
    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + windowMs };
    }
    
    record.count++;
    requestCounts.set(sessionId, record);
    
    const allowed = record.count <= maxRequestsPerMinute;
    const resetsIn = Math.max(0, Math.ceil((record.resetTime - now) / 1000));
    
    return {
      allowed,
      currentCount: record.count,
      limit: maxRequestsPerMinute,
      resetsIn,
    };
  },
});

/**
 * Context length guardrail
 */
export const checkContextLengthTool = createTool({
  id: "check-context-length",
  description:
    "Check if the conversation context is getting too long and may need summarization.",
  inputSchema: z.object({
    messageCount: z.number().describe("Number of messages in conversation"),
    totalCharacters: z.number().describe("Total character count of conversation"),
  }),
  outputSchema: z.object({
    needsSummarization: z.boolean(),
    recommendation: z.string(),
    messageCountOk: z.boolean(),
    characterCountOk: z.boolean(),
  }),
  execute: async ({ context }) => {
    const { messageCount, totalCharacters } = context;
    
    const maxMessages = 50;
    const maxCharacters = 100000;
    
    const messageCountOk = messageCount <= maxMessages;
    const characterCountOk = totalCharacters <= maxCharacters;
    const needsSummarization = !messageCountOk || !characterCountOk;
    
    let recommendation = "Context size is healthy.";
    if (needsSummarization) {
      if (!messageCountOk) {
        recommendation = `Conversation has ${messageCount} messages. Consider summarizing earlier messages to maintain performance.`;
      } else if (!characterCountOk) {
        recommendation = `Conversation is ${totalCharacters} characters. Consider summarizing to reduce context size.`;
      }
    }
    
    return {
      needsSummarization,
      recommendation,
      messageCountOk,
      characterCountOk,
    };
  },
});
