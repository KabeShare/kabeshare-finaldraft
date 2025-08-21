export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/cart/',
          '/my-orders/',
          '/order-placed/',
          '/add-address/',
          '/user-point/',
          '/seller/',
        ],
      },
    ],
    sitemap: 'https://kabeshare.com/sitemap.xml',
  };
}
