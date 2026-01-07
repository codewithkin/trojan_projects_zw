import { Hono } from "hono";
import { stream } from "hono/streaming";
import { authMiddleware } from "../lib/auth/middleware";
import { getBusinessAgent } from "../mastra";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const aiRoute = new Hono()
  /**
   * POST /api/ai/chat - Stream a response from the AI agent
   * 
   * Request body:
   * {
   *   messages: Array<{ role: "user" | "assistant", content: string }>,
   *   stream?: boolean
   * }
   */
  .post("/chat", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Only staff/support/admin can use AI chat
    if (user.role !== "staff" && user.role !== "support" && user.role !== "admin") {
      return c.json({ error: "Forbidden" }, 403);
    }

    try {
      const body = await c.req.json();
      const { messages, stream: shouldStream = true } = body as {
        messages: ChatMessage[];
        stream?: boolean;
      };

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return c.json({ error: "Messages are required" }, 400);
      }

      const agent = getBusinessAgent();

      // Format messages for the agent
      const formattedMessages = messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      if (shouldStream) {
        // Streaming response
        c.header("Content-Type", "text/event-stream");
        c.header("Cache-Control", "no-cache");
        c.header("Connection", "keep-alive");

        return stream(c, async (stream) => {
          try {
            const response = await agent.stream(formattedMessages);

            // Stream the text chunks
            for await (const chunk of response.textStream) {
              // Send as SSE format
              await stream.write(`data: ${JSON.stringify({ type: "text", content: chunk })}\n\n`);
            }

            // Get final metrics
            const text = await response.text;
            const usage = await response.usage;

            // Send completion event with metrics
            await stream.write(
              `data: ${JSON.stringify({
                type: "done",
                usage: usage || null,
                fullText: text,
              })}\n\n`
            );
          } catch (error) {
            console.error("Streaming error:", error);
            await stream.write(
              `data: ${JSON.stringify({
                type: "error",
                error: error instanceof Error ? error.message : "Unknown error",
              })}\n\n`
            );
          }
        });
      } else {
        // Non-streaming response
        const response = await agent.generate(formattedMessages);

        return c.json({
          text: response.text,
          usage: response.usage || null,
        });
      }
    } catch (error) {
      console.error("AI chat error:", error);
      return c.json(
        {
          error: error instanceof Error ? error.message : "Failed to process chat",
        },
        500
      );
    }
  })

  /**
   * POST /api/ai/quick - Get a quick non-streaming response
   * 
   * Request body:
   * {
   *   prompt: string
   * }
   */
  .post("/quick", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Only staff/support/admin can use AI chat
    if (user.role !== "staff" && user.role !== "support" && user.role !== "admin") {
      return c.json({ error: "Forbidden" }, 403);
    }

    try {
      const body = await c.req.json();
      const { prompt } = body as { prompt: string };

      if (!prompt || typeof prompt !== "string") {
        return c.json({ error: "Prompt is required" }, 400);
      }

      const agent = getBusinessAgent();

      const response = await agent.generate([
        { role: "user", content: prompt },
      ]);

      return c.json({
        text: response.text,
        usage: response.usage || null,
      });
    } catch (error) {
      console.error("AI quick chat error:", error);
      return c.json(
        {
          error: error instanceof Error ? error.message : "Failed to process request",
        },
        500
      );
    }
  })

  /**
   * GET /api/ai/health - Check if AI service is available
   */
  .get("/health", async (c) => {
    try {
      const agent = getBusinessAgent();
      
      return c.json({
        status: "ok",
        agentName: "Trojan Business Insights",
        available: !!agent,
      });
    } catch (error) {
      return c.json({
        status: "error",
        error: error instanceof Error ? error.message : "AI service unavailable",
      }, 503);
    }
  });

export default aiRoute;
