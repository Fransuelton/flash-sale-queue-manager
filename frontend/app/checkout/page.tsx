"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CheckoutContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const variantId = params.get("variantId");

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Checkout Simulado
          </h1>
          <p className="text-zinc-400 text-sm mb-6">
            Em produção, você seria redirecionado para o checkout da Shopify.
          </p>

          <div className="bg-zinc-800 rounded-xl p-4 text-left mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Produto</span>
              <span className="text-white font-medium">HypeShoe X1 Ultra</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Preço</span>
              <span className="text-white font-medium">R$ 1.299,00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Order ID</span>
              <span className="text-violet-400 font-mono text-xs truncate ml-4">
                {orderId ?? "—"}
              </span>
            </div>
            {variantId && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Variant</span>
                <span className="text-violet-400 font-mono text-xs truncate ml-4">
                  {variantId}
                </span>
              </div>
            )}
          </div>

          <button className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-violet-600 hover:bg-violet-500 active:scale-95 transition-all text-white">
            Confirmar Pedido (Mock)
          </button>

          <p className="text-zinc-600 text-xs mt-4">
            Simulação — nenhum pagamento será processado
          </p>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
