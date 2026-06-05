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
  const result = await fetch(`/api/queue/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  return result.json() as Promise<JoinQueueResponse>;
}

export async function getQueueStatus(
  userId: string,
): Promise<QueueStatusResponse> {
  const result = await fetch(`/api/queue/status/${userId}`);
  return result.json() as Promise<QueueStatusResponse>;
}
