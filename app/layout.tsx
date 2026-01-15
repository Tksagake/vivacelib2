import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vivace Music Kenya Resource Center",
  description: "Powered by DiversiWorks Times Group",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Logo.png" />
        <meta name="theme-color" content="#6b46c1" />
        <meta name="description" content="Vivace Music School Kenya Library" />
        <meta name="author" content="Vivace Team" />
        <meta name="keywords" content="Vivace, Music, School, Kenya, Library, VivaceKenya" />
        <meta property="og:title" content="Vivace Music Kenya Resource Center" />
        <meta property="og:description" content="Created with love by the Vivace Team" />
        <meta property="og:image" content="/Logo.png" />
        <meta property="og:url" content="https://library.vivacekenya.co.ke" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="VivaceKenya" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vivace Music Kenya Resource Center" />
        <meta name="twitter:description" content="Created with love by the Vivace Team" />
        <meta name="twitter:image" content="/Logo.png" />
        <meta name="twitter:site" content="@VivaceKenya" />
        <meta name="twitter:creator" content="@VivaceKenya" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VivaceKenya" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="VivaceKenya" />
        <meta name="msapplication-TileColor" content="#6b46c1" />
        <meta name="msapplication-TileImage" content="/Logo.png" />
        <meta name="theme-color" content="#6b46c1" />
        <meta name="apple-mobile-web-app-icon" content="/Logo.png" />
        <meta name="msapplication-config" content="/Logo.png" />
        </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
