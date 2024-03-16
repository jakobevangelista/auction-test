import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "@/trpc/react";
import { cookies } from "next/headers";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auction App",
  description: "Test Auction App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${GeistSans.variable}${GeistMono.variable} `}
          suppressHydrationWarning
        >
          <TRPCReactProvider cookies={cookies().toString()}>
            <ThemeProvider attribute="class" defaultTheme="dark">
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </ThemeProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
