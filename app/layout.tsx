import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import "./globals.css";
import { Providers } from "./providers";

import { getUserWithRole } from "@/utils/auth";
import { UserRoleProvider } from "@/utils/context/UserRoleContext";

config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "West Telco Marketplace",
  description: "Partner license management",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { user, role } = await getUserWithRole();

  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <UserRoleProvider initialUser={user} initialRole={role}>
          <Providers>
            <main className="min-h-screen flex flex-col items-center bg-[#f4f4f5] min-w-[768px]">
              {children}
            </main>
          </Providers>
        </UserRoleProvider>
      </body>
    </html>
  );
}
