import { auth } from "@trojan_projects_zw/auth";
import { env } from "@trojan_projects_zw/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import preferencesRoute from "./routes/preferences";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: (origin) => {
      // Allow configured web origins
      const allowedOrigins = [
        env.CORS_ORIGIN,
        "http://localhost:3001",
        "http://10.255.235.15:3001",
        "http://localhost:8081",
        "http://10.255.235.15:8081"
      ];
      
      if (allowedOrigins.includes(origin)) return origin;
      
      // Allow custom app schemes
      if (origin.startsWith("trojan_projects_zw://")) return origin;
      if (origin.startsWith("exp://")) return origin;
      if (origin.startsWith("mybettertapp://")) return origin;
      
      return false;
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/preferences", preferencesRoute);

app.get("/", (c) => {
  return c.text("OK");
});

export default app;
