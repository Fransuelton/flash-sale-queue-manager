import { redis } from "./lib/redis.js";
import { createCheckoutForUser } from "./lib/shopify.js";

const QUEUE_KEY = process.env.QUEUE_KEY ?? "flash_sale_queue";
const CHECKOUT_URL_PREFIX = process.env.CHECKOUT_URL_PREFIX ?? "checkout_url:";
const BATCH_SIZE = Number(process.env.QUEUE_BATCH_SIZE ?? 5);
const INTERVAL_MS = Number(process.env.WORKER_INTERVAL_MS ?? 5000);
const VARIANT_ID = process.env.SHOPIFY_PRODUCT_VARIANT_ID ?? "";

async function processBatch() {
  try {
    // TODO: Implementar lógica de desenfileiramento e criação de checkout
    // 1. Usar redis.zpopmin(QUEUE_KEY, BATCH_SIZE) para retirar os N primeiros usuários da fila
    // 2. Para cada userId retornado:
    //    a. Chamar createCheckoutForUser(VARIANT_ID) para gerar a checkoutUrl na Shopify
    //    b. Salvar a URL no Redis: redis.setex(`${CHECKOUT_URL_PREFIX}${userId}`, 900, checkoutUrl)
    //       (TTL de 15 min para o usuário completar o checkout)
    //    c. Tratar erros individuais sem interromper o batch inteiro
    console.log(`[Worker] TODO: processar batch de ${BATCH_SIZE} da fila "${QUEUE_KEY}"`);
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
