import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VivaceKenya Library 2.0",
  description: "Kenya's Premier Digital Music Library - Access comprehensive music education resources, ABRSM preparation materials, and AI-powered learning assistance.",
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
        <meta name="theme-color" content="#1e3a5f" />
        <meta name="description" content="Vivace Music School Kenya - Digital Library for Music Education" />
        <meta name="author" content="Vivace Music School Kenya" />
        <meta name="keywords" content="Vivace, Music, School, Kenya, Library, ABRSM, Music Theory, Music Education" />
        <meta property="og:title" content="VivaceKenya Library 2.0" />
        <meta property="og:description" content="Kenya's Premier Digital Music Library" />
        <meta property="og:image" content="/Logo.png" />
        <meta property="og:url" content="https://library.vivacekenya.co.ke" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="VivaceKenya" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VivaceKenya Library 2.0" />
        <meta name="twitter:description" content="Kenya's Premier Digital Music Library" />
        <meta name="twitter:image" content="/Logo.png" />
        <meta name="twitter:site" content="@VivaceKenya" />
        <meta name="twitter:creator" content="@VivaceKenya" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VivaceKenya" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="VivaceKenya" />
        <meta name="msapplication-TileColor" content="#1e3a5f" />
        <meta name="msapplication-TileImage" content="/Logo.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
