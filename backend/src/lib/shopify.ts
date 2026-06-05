const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN ?? "";
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";

const STOREFRONT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`;

type CartCreateResponse = {
  cartCreate: {
    cart: { checkoutUrl: string } | null;
    userErrors: { field: string; message: string }[];
  };
};
export interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
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
    throw new Error(
      `Shopify API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<ShopifyGraphQLResponse<T>>;
}

export async function createCheckoutForUser(
  variantId: string,
): Promise<string | null> {
  const query = `
  mutation cartCreate($variantId: ID!) {
    cartCreate(input: {
      lines: [{ quantity: 1, merchandiseId: $variantId }]
    }) {
      cart {
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }`;

  const variables = { variantId };

  const result = await shopifyFetch<CartCreateResponse>(query, variables);

  if (result.errors) {
    console.error("Shopify API returned errors:", result.errors);
    throw new Error("Failed to create checkout");
  }

  if (result.data?.cartCreate.userErrors.length) {
    console.error(
      "Shopify API returned user errors:",
      result.data.cartCreate.userErrors,
    );
    throw new Error("Failed to create checkout due to user errors");
  }

  return result.data?.cartCreate.cart?.checkoutUrl ?? null;
}
