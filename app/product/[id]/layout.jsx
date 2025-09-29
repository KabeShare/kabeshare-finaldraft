export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    // Fetch product data for dynamic metadata
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_URL || 'https://kabeshare.com'
      }/api/product/single?id=${id}`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (response.ok) {
      const data = await response.json();
      const product = data.product;

      return {
        title: `${product.name} - Kabe Share`,
        description:
          product.description ||
          `Discover ${product.name} at Kabe Share. Premium quality products with fast delivery.`,
        robots: {
          index: true,
          follow: true,
        },
        alternates: {
          canonical: 'https://kabeshare.com/',
        },
        openGraph: {
          title: `${product.name} - Kabe Share`,
          description:
            product.description || `Discover ${product.name} at Kabe Share.`,
          images: product.image ? [product.image[0]] : [],
        },
      };
    }
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
  }

  // Fallback metadata
  return {
    title: 'Product - Kabe Share',
    description: 'Discover amazing products at Kabe Share.',
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: 'https://kabeshare.com/',
    },
  };
}

export default function ProductLayout({ children }) {
  return children;
}
