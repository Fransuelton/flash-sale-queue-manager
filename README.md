# Flash Sale Queue Manager

A headless virtual queue system for Shopify high-demand product drops. When a product goes live, users join a virtual queue managed by Redis. A background worker processes the queue in batches, creating Shopify checkouts via the Storefront API only for users whose turn has come — preventing traffic overload and inventory conflicts.

## Architecture

```
User clicks "Join Queue"
        │
        ▼
Frontend (Next.js)
  └─ generates UUID
  └─ POST /api/queue/join
        │
        ▼
Backend (Bun + Hono)
  └─ ZADD flash_sale_queue <timestamp> <userId>
        │
        ▼
Frontend polls GET /api/queue/status/:userId
  └─ every 3s checks position
        │
        ▼
Worker (background)
  └─ ZPOPMIN flash_sale_queue <batchSize>
  └─ calls Shopify Storefront API → cartCreate
  └─ SETEX checkout_url:<userId> 900 <checkoutUrl>
        │
        ▼
Frontend receives status "ready"
  └─ redirects to checkoutUrl
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TailwindCSS v4, TypeScript |
| Backend | Bun, Hono |
| Queue | Redis (Sorted Sets) |
| Integration | Shopify Storefront API (GraphQL) |

## Project Structure

```
flash-sale-queue-manager/
├── frontend/               # Next.js app
│   ├── app/
│   │   ├── page.tsx        # Product page with queue states
│   │   └── checkout/       # Checkout page (mock)
│   ├── hooks/
│   │   └── useQueue.ts     # Queue hook with polling logic
│   └── services/
│       └── queueService.ts # HTTP calls to backend
└── backend/                # Bun + Hono server
    └── src/
        ├── index.ts        # Server entry point
        ├── routes/
        │   └── queue.ts    # POST /join · GET /status/:userId
        ├── lib/
        │   ├── redis.ts    # Redis client
        │   └── shopify.ts  # Storefront API client
        └── worker.ts       # Background batch processor
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh)
- [Node.js](https://nodejs.org) 20+
- [Redis](https://redis.io) (or [Redis Stack](https://redis.io/docs/stack/) for RedisInsight UI)
- A Shopify store with Storefront API access

### Setup

**1. Clone the repository**
```bash
git clone https://github.com/Fransuelton/flash-sale-queue-manager.git
cd flash-sale-queue-manager
```

**2. Backend**
```bash
cd backend
bun install
cp .env.example .env
# Fill in your credentials in .env
bun run dev
```

**3. Worker** (separate terminal)
```bash
cd backend
bun run worker
```

**4. Frontend**
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

**backend/.env**

| Variable | Description |
|---|---|
| `PORT` | Backend server port (default: `3001`) |
| `REDIS_URL` | Redis connection URL |
| `SHOPIFY_STORE_DOMAIN` | Your store domain (e.g. `your-store.myshopify.com`) |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API access token |
| `SHOPIFY_PRODUCT_VARIANT_ID` | Target variant GID (e.g. `gid://shopify/ProductVariant/123`) |
| `QUEUE_BATCH_SIZE` | Users processed per worker cycle (default: `5`) |
| `WORKER_INTERVAL_MS` | Worker polling interval in ms (default: `5000`) |

**frontend/.env.local**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Backend URL (default: `http://localhost:3001`) |

## Redis Keys

| Key | Type | Description |
|---|---|---|
| `flash_sale_queue` | Sorted Set | Active queue — score is join timestamp |
| `checkout_url:<userId>` | String | Checkout URL, TTL 900s (15 min) |

## Monitoring

If using Redis Stack, RedisInsight is available at [http://localhost:8001](http://localhost:8001) for real-time queue inspection.

## License

MIT
