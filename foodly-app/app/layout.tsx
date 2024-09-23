import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "../providers/next-ui";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { ReactQueryProvider } from "@/providers/react-query";
import { NextAuthProvider } from "@/providers/next-auth";
import { BottomMenu } from "@/components/molecules/bottom-menu";
import Header from "@/components/molecules/header";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
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
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <NextAuthProvider>
          <ReactQueryProvider>
            <Providers
              themeProps={{ attribute: "class", defaultTheme: "light" }}
            >
              <div className="relative flex flex-col h-screen overflow-y-hidden bg-center bg-cover bg-banner bg-no-repeat">
                <Header />
                <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                  {children}
                </main>
                <BottomMenu />
              </div>
            </Providers>
          </ReactQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
