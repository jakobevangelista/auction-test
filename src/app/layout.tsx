import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "@/trpc/react";
import { cookies } from "next/headers";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/theme-provider";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlusEv Stack",
  description: "The one and only stack you'll ever need",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${GeistSans.variable}${GeistMono.variable}`}>
          <TRPCReactProvider cookies={cookies().toString()}>
            <ThemeProvider attribute="class" defaultTheme="dark">
              {children}
            </ThemeProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
