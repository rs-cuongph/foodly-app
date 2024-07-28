import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import Head from "next/head";
import clsx from "clsx";
import { Inter } from "next/font/google";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <Head>
        <link
          href="/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
        <link href="/site.webmanifest" rel="manifest" />
        <meta content="#ffffff" name="theme-color" />
      </Head>
      <body
        suppressHydrationWarning
        className={clsx(
          inter.className,
          "min-h-screen bg-background antialiased",
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          {/* <NextAuthProvider> */}
          <div className="relative">{children}</div>
          {/* </NextAuthProvider> */}
        </Providers>
      </body>
    </html>
  );
}
