// app/sitemap.js

import { products } from './assets/productData'; // Assuming this is how you get product data

const URL = 'https://kabeshare.com';

export default async function sitemap() {
  // Fetch all products to generate dynamic routes
  // In a real app, you would fetch this from your database or API
  // For example: const response = await fetch(`${URL}/api/product/list`);
  // const { products } = await response.json();

  const productUrls = products.map((product) => ({
    url: `${URL}/product/${product._id}`,
    lastModified: new Date(), // Or use a date from your product data if available
  }));

  // Add your static routes
  const staticUrls = [
    {
      url: `${URL}/`,
      lastModified: new Date(),
    },
    {
      url: `${URL}/all-products`,
      lastModified: new Date(),
    },
    {
      url: `${URL}/vision`,
      lastModified: new Date(),
    },
  ];

  return [...staticUrls, ...productUrls];
}