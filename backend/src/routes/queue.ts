import { Hono } from "hono";
import { redis } from "../lib/redis.js";

const queue = new Hono();

const QUEUE_KEY = process.env.QUEUE_KEY ?? "flash_sale_queue";
const CHECKOUT_URL_PREFIX = process.env.CHECKOUT_URL_PREFIX ?? "checkout_url:";

queue.post("/join", async (c) => {
  const body = await c.req.json<{ userId: string }>();
  const { userId } = body;

  if (!userId) {
    return c.json({ error: "userId is required" }, 400);
  }
  const existingRank = await redis.zrank(QUEUE_KEY, userId);

  if (existingRank !== null) {
    return c.json({ error: "User already in queue" }, 409);
  }

  await redis.zadd(QUEUE_KEY, Date.now(), userId);

  return c.json({ userId, message: "Joined queue (not yet implemented)" }, 201);
});

queue.get("/status/:userId", async (c) => {
  const { userId } = c.req.param();

  // TODO: Implementar lógica de verificação de status na fila
  // 1. Verificar se já existe uma checkoutUrl pronta: redis.get(`${CHECKOUT_URL_PREFIX}${userId}`)
  //    - Se existir: retornar { status: "ready", checkoutUrl, position: null }
  // 2. Caso contrário, verificar posição na fila: redis.zrank(QUEUE_KEY, userId)
  //    - Se rank === null: retornar { status: "not_found" }
  //    - Se rank >= 0: retornar { status: "queued", position: rank + 1, checkoutUrl: null }

  return c.json({
    userId,
    status: "not_found",
    position: null,
    checkoutUrl: null,
  });
});

export default queue;
