import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
// import { getLocale, getMessages } from "next-intl/server";
// import { NextIntlClientProvider } from 'next-intl'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "West Telco Marketplace",
  description: "Partner license management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <NextIntlClientProvider messages={messages}> */}
          <Providers>
            <main className="min-h-screen flex flex-col items-center">
              {children}
            </main>
          </Providers>
        {/* </NextIntlClientProvider> */}
      </body>
    </html>
  );
}
