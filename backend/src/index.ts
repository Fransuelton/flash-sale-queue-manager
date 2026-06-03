import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { redis } from "./lib/redis.js";
import queueRoutes from "./routes/queue.js";

const app = new Hono();
const PORT = Number(process.env.PORT ?? 3001);

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.route("/api/queue", queueRoutes);

app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

redis.connect().then(() => {
  console.log(`[Server] Flash Sale Backend running on port ${PORT}`);
});

export default {
  port: PORT,
  fetch: app.fetch,
};
