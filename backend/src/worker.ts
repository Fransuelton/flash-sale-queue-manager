import { redis } from "./lib/redis.js";
import { createCheckoutForUser } from "./lib/shopify.js";

const QUEUE_KEY = process.env.QUEUE_KEY ?? "flash_sale_queue";
const CHECKOUT_URL_PREFIX = process.env.CHECKOUT_URL_PREFIX ?? "checkout_url:";
const BATCH_SIZE = Number(process.env.QUEUE_BATCH_SIZE ?? 5);
const INTERVAL_MS = Number(process.env.WORKER_INTERVAL_MS ?? 5000);
const VARIANT_ID = process.env.SHOPIFY_PRODUCT_VARIANT_ID ?? "";

async function processBatch() {
  try {
    const result = await redis.zpopmin(QUEUE_KEY, BATCH_SIZE);

    const userIds = result.filter((_, i) => i % 2 === 0); // Extrai apenas os userIds (pares)

    if (userIds.length === 0) {
      console.log("[Worker] Nenhum usuário na fila para processar");
      return;
    }

    for (const userId of userIds) {
      try {
        const checkoutUrl = await createCheckoutForUser(VARIANT_ID);

        if (checkoutUrl) {
          await redis.setex(
            `${CHECKOUT_URL_PREFIX}${userId}`,
            900,
            checkoutUrl,
          ); // Expira em 15 minutos (900 segundos)
          console.log(
            `[Worker] Gerado checkout para userId ${userId}: ${checkoutUrl}`,
          );
        }
      } catch (err) {
        console.error(
          `[Worker] Erro ao gerar checkout para userId ${userId}:`,
          err,
        );
      }
    }
  } catch (err) {
    console.error("[Worker] Erro no processamento do batch:", err);
  }
}

async function startWorker() {
  await redis.connect();
  console.log(`[Worker] Iniciado — processando a cada ${INTERVAL_MS}ms`);

  setInterval(processBatch, INTERVAL_MS);
}

startWorker();
