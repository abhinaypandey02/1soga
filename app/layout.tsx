import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Navbar from "./components/navbar";
import { AuthWrapper } from "naystack/auth";
import { ApolloWrapperNext } from "naystack/graphql/client";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = localFont({
  src: "../fonts/sans.ttf",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "ONE SOGA \u2014 The NCR Movement",
  description: "The movement that united the NCR. Official merch for the revolution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${sans.variable} antialiased`}
      >
      <AuthWrapper>
        <ApolloWrapperNext>
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
          <Navbar />

          <div className="flex-1">
            {children}
          </div>

          {/* ── Footer ── */}
          <footer className="border-t-2 border-[var(--foreground)] bg-[var(--foreground)] px-4 py-6 sm:px-6 sm:py-8 md:px-12">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:gap-4 md:flex-row">
              <span className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">
                ONE SOGA
              </span>
              <span className="font-[family-name:var(--font-body)] text-[10px] text-white/40 sm:text-xs">
                Soga &mdash; For the people, by the people
              </span>
            </div>
          </footer>
        </div>

        </ApolloWrapperNext>
      </AuthWrapper>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
