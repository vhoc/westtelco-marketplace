import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import "./globals.css";
import { Providers } from "./providers";
// import { getLocale, getMessages } from "next-intl/server";
// import { NextIntlClientProvider } from 'next-intl'
config.autoAddCss = false;

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
            <main className="min-h-screen flex flex-col items-center bg-[#f4f4f5] min-w-[768px]">
              {children}
            </main>
          </Providers>
        {/* </NextIntlClientProvider> */}
      </body>
    </html>
  );
}
