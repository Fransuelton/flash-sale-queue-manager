const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

export interface JoinQueueResponse {
  userId: string;
  message: string;
}

export interface QueueStatusResponse {
  userId: string;
  status: "queued" | "ready" | "not_found";
  position: number | null;
  checkoutUrl: string | null;
}

export async function joinQueue(userId: string): Promise<JoinQueueResponse> {
  // TODO: Implementar chamada real ao POST /api/queue/join com o userId no body
  // Deve retornar { userId, message }
  return { userId, message: "Mocked: joined queue" };
}

export async function getQueueStatus(userId: string): Promise<QueueStatusResponse> {
  // TODO: Implementar chamada real ao GET /api/queue/status/:userId
  // Deve retornar { userId, status, position, checkoutUrl }
  return {
    userId,
    status: "queued",
    position: 1,
    checkoutUrl: null,
  };
}
