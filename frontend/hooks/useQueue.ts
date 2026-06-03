"use client";

import { useState, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { joinQueue, getQueueStatus } from "@/services/queueService";

type QueueStatus = "idle" | "queued" | "ready" | "done";

const POLLING_INTERVAL_MS = 3000;

export function useQueue() {
  const [status, setStatus] = useState<QueueStatus>("idle");
  const [position, setPosition] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const userIdRef = useRef<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (userId: string) => {
      // TODO: Implementar lógica de polling real
      // A cada POLLING_INTERVAL_MS, chamar getQueueStatus(userId) e:
      //   - Se status === "queued": atualizar position com response.position
      //   - Se status === "ready": parar o polling, chamar stopPolling(),
      //     setar status para "ready" e redirecionar para response.checkoutUrl
      //   - Se status === "not_found": tratar erro (usuário expirou da fila?)
      pollingRef.current = setInterval(() => {
        console.log("TODO: poll status for", userId);
      }, POLLING_INTERVAL_MS);
    },
    [stopPolling]
  );

  const joinQueue_ = useCallback(async () => {
    if (status !== "idle") return;

    setIsLoading(true);
    try {
      const userId = uuidv4();
      userIdRef.current = userId;

      await joinQueue(userId);

      setStatus("queued");
      startPolling(userId);
    } catch (err) {
      console.error("Erro ao entrar na fila:", err);
    } finally {
      setIsLoading(false);
    }
  }, [status, startPolling]);

  return {
    status,
    position,
    isLoading,
    joinQueue: joinQueue_,
  };
}
