const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN ?? "";
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";

const STOREFRONT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`;

export interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<ShopifyGraphQLResponse<T>> {
  const response = await fetch(STOREFRONT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ShopifyGraphQLResponse<T>>;
}

// TODO: Implementar lógica de criação de checkout
// Usar a mutation cartCreate (nova API) ou checkoutCreate (legado) da Storefront API.
// Deve receber um variantId, criar o cart/checkout para o usuário e retornar a checkoutUrl.
export async function createCheckoutForUser(_variantId: string): Promise<string | null> {
  return null;
}
