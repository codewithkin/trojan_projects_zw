import { Mastra } from "@mastra/core/mastra";
import { businessInsightsAgent } from "./agents/business-insights-agent";

export const mastra = new Mastra({
  agents: { businessInsightsAgent },
});

// Helper to get the business insights agent
export const getBusinessAgent = () => mastra.getAgent("businessInsightsAgent");
