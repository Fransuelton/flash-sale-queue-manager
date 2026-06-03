"use client";

import { useQueue } from "@/hooks/useQueue";

export default function ProductPage() {
  const { status, position, joinQueue, isLoading } = useQueue();

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Product Card */}
        <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
          {/* Product Image Placeholder */}
          <div className="w-full h-72 bg-zinc-800 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 to-zinc-900/60" />
            <div className="relative text-center">
              <div className="text-6xl mb-3">👟</div>
              <span className="text-xs font-semibold tracking-widest text-violet-400 uppercase">
                Drop Exclusivo
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-1">
              <h1 className="text-2xl font-bold text-white leading-tight">
                HypeShoe X1 Ultra
              </h1>
              <span className="text-xs bg-violet-600 text-white px-2 py-1 rounded-full font-semibold">
                LIMITED
              </span>
            </div>
            <p className="text-zinc-400 text-sm mb-4">
              Edição limitada — apenas 100 unidades disponíveis.
            </p>
            <p className="text-2xl font-bold text-violet-400 mb-6">R$ 1.299,00</p>

            {/* Queue Status Area */}
            <QueueStatusBanner status={status} position={position} />

            {/* CTA Button */}
            <button
              onClick={joinQueue}
              disabled={status !== "idle" || isLoading}
              className="w-full mt-4 py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                bg-violet-600 hover:bg-violet-500 active:scale-95 text-white
                disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              {isLoading
                ? "Aguarde..."
                : status === "idle"
                ? "Entrar na Fila de Compra"
                : status === "queued"
                ? "Você já está na fila"
                : status === "ready"
                ? "Ir para o Checkout"
                : "Compra Finalizada"}
            </button>
          </div>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-4">
          Powered by Flash Sale Queue Manager
        </p>
      </div>
    </main>
  );
}

type QueueStatus = "idle" | "queued" | "ready" | "done";

function QueueStatusBanner({
  status,
  position,
}: {
  status: QueueStatus;
  position: number | null;
}) {
  if (status === "idle") {
    return (
      <div className="rounded-xl bg-zinc-800/60 border border-zinc-700 p-4 text-center">
        <p className="text-zinc-400 text-sm">
          Clique no botão abaixo para entrar na fila de compra.
        </p>
      </div>
    );
  }

  if (status === "queued") {
    return (
      <div className="rounded-xl bg-violet-900/30 border border-violet-700/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-300 text-xs font-semibold uppercase tracking-wider mb-0.5">
              Você está na fila
            </p>
            <p className="text-white text-sm">
              {position !== null
                ? `Posição atual: #${position}`
                : "Calculando posição..."}
            </p>
          </div>
          {/* Spinner */}
          <svg
            className="animate-spin h-5 w-5 text-violet-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (status === "ready") {
    return (
      <div className="rounded-xl bg-green-900/30 border border-green-600/50 p-4 text-center">
        <p className="text-green-400 font-semibold text-sm">
          ✓ Sua vez chegou! Redirecionando para o checkout...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-zinc-800/60 border border-zinc-700 p-4 text-center">
      <p className="text-zinc-400 text-sm">Compra concluída. Obrigado!</p>
    </div>
  );
}
