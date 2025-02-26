const SHOPIFY_GRAPHQL_URL = `https://${process.env.SHOPIFY_SHOP_NAME}/admin/api/2024-01/graphql.json`;

async function shopifyGraphQLRequest(query: string) {
  const response = await fetch(SHOPIFY_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN as string,
    },
    body: JSON.stringify({ query }),
  });

  return response.json();
}

export async function GET() {
  try {
    const query = `
      {
        customers(first: 10) {
          edges {
            node {
              id
              firstName
              lastName
              email
              createdAt
            }
          }
        }
      }
    `;

    const data = await shopifyGraphQLRequest(query);
    
    const customers = data.data.customers.edges.map((edge: any) => ({
      id: edge.node.id,
      first_name: edge.node.firstName,
      last_name: edge.node.lastName,
      email: edge.node.email,
      created_at: edge.node.createdAt
    }));

    return Response.json(customers);
  } catch (error) {
    console.error('Shopify GraphQL Hatası:', error);
    return Response.json({ error: 'Müşteri listesi alınamadı' }, { status: 500 });
  }
} 