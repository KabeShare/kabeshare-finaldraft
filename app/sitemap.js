// app/sitemap.js

const URL = 'https://kabeshare.com';

export default async function sitemap() {
  let products = [];

  try {
    // Fetch products from your API
    const response = await fetch(`${URL}/api/product/list`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (response.ok) {
      const data = await response.json();
      products = data.products || [];
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    // Continue with empty products array if fetch fails
  }

  const productUrls = products.map((product) => ({
    url: `${URL}/product/${product._id}`,
    lastModified: new Date(
      product.updatedAt || product.createdAt || new Date()
    ),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Add your static routes
  const staticUrls = [
    {
      url: `${URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${URL}/all-products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${URL}/vision`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  return [...staticUrls, ...productUrls];
}
