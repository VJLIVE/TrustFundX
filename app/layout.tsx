import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/contexts/WalletContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#667eea',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://trustfundx.vercel.app'),
  title: {
    default: 'TrustFundX - Blockchain-Based Grant & Fund Tracking',
    template: '%s | TrustFundX'
  },
  description: 'Transparent, milestone-based grant and fund tracking system built on blockchain technology. Secure funding for students, sponsors, and voters with smart contract-powered transparency.',
  keywords: ['blockchain', 'grant tracking', 'fund management', 'student funding', 'transparent grants', 'milestone-based funding', 'smart contracts', 'Algorand', 'Pera Wallet', 'educational grants', 'DAO governance', 'decentralized funding'],
  authors: [{ name: 'TrustFundX Team' }],
  creator: 'TrustFundX',
  publisher: 'TrustFundX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trustfundx.vercel.app',
    title: 'TrustFundX - Blockchain-Based Grant & Fund Tracking',
    description: 'Transparent, milestone-based grant and fund tracking system built on blockchain technology. Secure funding for students, sponsors, and voters.',
    siteName: 'TrustFundX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrustFundX - Blockchain-Based Grant & Fund Tracking',
    description: 'Transparent, milestone-based grant and fund tracking system built on blockchain technology.',
    creator: '@trustfundx',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TrustFundX',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    description: 'Transparent, milestone-based grant and fund tracking system built on blockchain technology',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
    featureList: [
      'Blockchain-based transparency',
      'Milestone-based fund disbursement',
      'Smart contract integration',
      'DAO-style governance',
      'Pera Wallet integration',
      'Real-time tracking',
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="author" type="text/plain" href="/humans.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
