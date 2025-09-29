import { Outfit } from 'next/font/google';
import './globals.css';
import { AppContextProvider } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';
import { ConditionalClerkProvider } from '@/components/ConditionalClerkProvider';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500'] });

export const metadata = {
  title: 'Kabe Share',
  description:
    'An innovative e-commerce website with gamification features that boost engagement, customer loyalty, and sales through rewards, challenges, and achievements.',
  icons: {
    icon: '/assets/kabe_share.png',
    shortcut: '/assets/kabe_share.png',
    apple: '/assets/kabe_share.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      'index': true,
      'follow': true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: 'https://kabeshare.com/',
  },
  openGraph: {
    title: 'Kabe Share',
    description:
      'An innovative e-commerce website with gamification features that boost engagement, customer loyalty, and sales through rewards, challenges, and achievements.',
    url: 'https://kabeshare.com',
    siteName: 'Kabe Share',
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <ConditionalClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`}>
          <Toaster />
          <AppContextProvider>{children}</AppContextProvider>
        </body>
      </html>
    </ConditionalClerkProvider>
  );
}
